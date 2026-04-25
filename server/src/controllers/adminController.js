import { query } from '../config/database.js';
import cacheService from '../services/cacheService.js';

export const getDashboardStats = async (req, res) => {
    try {
        const cacheKey = 'admin:stats';
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                data: cachedData,
                fromCache: true
            });
        }

        // Parallelize queries for efficiency
        const [
            userCount,
            uploadCount,
            messageCount,
            reportCount,
            recentUsers,
            recentUploads
        ] = await Promise.all([
            query('SELECT COUNT(*) FROM users'),
            query('SELECT COUNT(*) FROM uploads'),
            query('SELECT COUNT(*) FROM direct_messages'),
            query('SELECT COUNT(*) FROM reports WHERE status = \'pending\''),
            query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'),
            query('SELECT id, title, type, created_at FROM uploads ORDER BY created_at DESC LIMIT 5')
        ]);

        const stats = {
            counts: {
                users: parseInt(userCount.rows[0].count),
                uploads: parseInt(uploadCount.rows[0].count),
                messages: parseInt(messageCount.rows[0].count),
                pendingReports: parseInt(reportCount.rows[0].count)
            },
            recentActivity: {
                users: recentUsers.rows,
                uploads: recentUploads.rows
            }
        };

        // Cache for 10 minutes
        await cacheService.set(cacheKey, stats, 600);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getTrends = async (req, res) => {
    try {
        const cacheKey = 'admin:trends';
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            return res.json({ success: true, data: cachedData, fromCache: true });
        }

        const [userTrends, uploadTrends] = await Promise.all([
            query(`
                SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count 
                FROM users 
                WHERE created_at > NOW() - INTERVAL '7 days' 
                GROUP BY date 
                ORDER BY date ASC
            `),
            query(`
                SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count 
                FROM uploads 
                WHERE created_at > NOW() - INTERVAL '7 days' 
                GROUP BY date 
                ORDER BY date ASC
            `)
        ]);

        const trends = {
            users: userTrends.rows,
            uploads: uploadTrends.rows
        };

        // Cache for 1 hour
        await cacheService.set(cacheKey, trends, 3600);

        res.json({ success: true, data: trends });
    } catch (error) {
        console.error('Admin trends error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUsers = async (req, res) => {
    try {

        const { page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;

        let sql = `SELECT id, username, email, role, created_at, is_active FROM users`;
        const params = [];

        if (search) {
            sql += ` WHERE username ILIKE $1 OR email ILIKE $1`;
            params.push(`%${search}%`);
        }

        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(sql, params);

        // Get total count for pagination
        let countSql = `SELECT COUNT(*) FROM users`;
        const countParams = [];
        if (search) {
            countSql += ` WHERE username ILIKE $1 OR email ILIKE $1`;
            countParams.push(`%${search}%`);
        }
        const countResult = await query(countSql, countParams);

        res.json({
            success: true,
            data: {
                users: result.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].count),
                    page: parseInt(page),
                    pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const result = await query(
            `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role`,
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User role updated', data: result.rows[0] });

        // Invalidate stats cache
        await cacheService.del('admin:stats');
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Toggle is_active
        const result = await query(
            `UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, username, is_active`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User status updated', data: result.rows[0] });

        // Invalidate stats cache
        await cacheService.del('admin:stats');
    } catch (error) {
        console.error('Toggle status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const getReports = async (req, res) => {
    try {
        const { status = 'pending', page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const result = await query(
            `SELECT r.*, 
                    u.username as reporter_username, 
                    t.username as reported_username,
                    up.title as upload_title
             FROM reports r
             LEFT JOIN users u ON r.reporter_id = u.id
             LEFT JOIN users t ON r.reported_id = t.id
             LEFT JOIN uploads up ON r.upload_id = up.id
             WHERE r.status = $1
             ORDER BY r.created_at DESC
             LIMIT $2 OFFSET $3`,
            [status, limit, offset]
        );

        const countResult = await query(
            `SELECT COUNT(*) FROM reports WHERE status = $1`,
            [status]
        );

        res.json({
            success: true,
            data: {
                reports: result.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].count),
                    page: parseInt(page),
                    pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const resolveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolution } = req.body; // status: 'resolved', 'dismissed'

        const result = await query(
            `UPDATE reports 
             SET status = $1, resolution = $2, resolved_at = NOW(), resolved_by = $3
             WHERE id = $4
             RETURNING *`,
            [status, resolution, req.user.id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        res.json({ success: true, message: 'Report resolved', data: result.rows[0] });

        // Invalidate stats cache
        await cacheService.del('admin:stats');
    } catch (error) {
        console.error('Resolve report error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getAdminUploads = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, type } = req.query;
        const offset = (page - 1) * limit;

        let sql = `
            SELECT u.*, us.username, us.email 
            FROM uploads u
            JOIN users us ON u.user_id = us.id
        `;
        const params = [];
        const conditions = [];

        if (search) {
            conditions.push(`(u.title ILIKE $${params.length + 1} OR us.username ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }

        if (type) {
            conditions.push(`u.type = $${params.length + 1}`);
            params.push(type);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(' AND ')}`;
        }

        sql += ` ORDER BY u.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(sql, params);

        // Count query
        let countSql = `SELECT COUNT(*) FROM uploads u JOIN users us ON u.user_id = us.id`;
        const countParams = search || type ? params.slice(0, params.length - 2) : [];
        if (conditions.length > 0) {
            countSql += ` WHERE ${conditions.join(' AND ')}`;
        }

        const countResult = await query(countSql, countParams);

        res.json({
            success: true,
            data: {
                uploads: result.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].count),
                    page: parseInt(page),
                    pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
                }
            }
        });
    } catch (error) {
        console.error('Admin get uploads error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteUpload = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(
            `UPDATE uploads SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1 RETURNING id, title`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Upload not found' });
        }

        res.json({ success: true, message: 'Upload deleted by admin' });

        // Invalidate caches
        await cacheService.del('admin:stats');
        await cacheService.delPattern('uploads:*');
    } catch (error) {
        console.error('Admin delete upload error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

