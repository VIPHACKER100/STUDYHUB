import { query } from '../config/database.js';

export const searchContent = async (req, res) => {
    try {
        const {
            q, // query string
            type, // file type (pdf, doc, etc.) or category (notes, assignment)
            subject,
            tags,
            uploader,
            dateFrom,
            dateTo,
            sortBy = 'newest',
            page = 1,
            limit = 20
        } = req.query;

        const offset = (page - 1) * limit;
        const params = [];
        let paramCount = 0;

        // Base Conditions
        let whereClause = `WHERE u.is_approved = TRUE AND u.privacy = 'public'`;

        // 1. Keyword Search (Title, Description)
        if (q) {
            paramCount++;
            params.push(`%${q}%`);
            whereClause += ` AND (u.title ILIKE $${paramCount} OR u.description ILIKE $${paramCount})`;
        }

        // 2. Type/Category Filter
        if (type) {
            paramCount++;
            params.push(type);
            whereClause += ` AND (u.file_type = $${paramCount} OR u.type = $${paramCount})`;
        }

        // 3. Subject Filter
        if (subject) {
            paramCount++;
            params.push(`%${subject}%`);
            whereClause += ` AND u.subject ILIKE $${paramCount}`;
        }

        // 4. Tags Filter (Specific tag match)
        if (tags) {
            const tagList = Array.isArray(tags) ? tags : tags.split(',');
            // For each tag, we check if it exists in the u.tags array
            // This ORs the tags (upload has ANY of the provided tags)
            // To AND them, we'd need multiple clauses or @> operator
            paramCount++;
            params.push(tagList);
            whereClause += ` AND u.tags && $${paramCount}`; // PostgreSQL array overlap operator
        }

        // 5. Uploader Filter
        if (uploader) {
            paramCount++;
            params.push(`%${uploader}%`);
            whereClause += ` AND us.username ILIKE $${paramCount}`;
        }

        // 6. Date Range
        if (dateFrom) {
            paramCount++;
            params.push(dateFrom);
            whereClause += ` AND u.created_at >= $${paramCount}`;
        }
        if (dateTo) {
            paramCount++;
            params.push(dateTo);
            whereClause += ` AND u.created_at <= $${paramCount}`;
        }

        // --- Execute Queries ---

        // Main Query
        let sql = `
            SELECT u.*, 
                   us.username, 
                   us.full_name,
                   us.avatar_url,
                   (SELECT COUNT(*) FROM upload_ratings r WHERE r.upload_id = u.id) as rating_count
            FROM uploads u
            JOIN users us ON u.user_id = us.id
            ${whereClause}
        `;

        // Sorting
        switch (sortBy) {
            case 'oldest':
                sql += ` ORDER BY u.created_at ASC`;
                break;
            case 'popular': // Most downloads
                sql += ` ORDER BY u.download_count DESC`;
                break;
            case 'rated': // Highest rated
                sql += ` ORDER BY u.average_rating DESC`;
                break;
            case 'newest':
            default:
                sql += ` ORDER BY u.created_at DESC`;
                break;
        }

        // Pagination
        sql += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        const queryParams = [...params, limit, offset];

        const result = await query(sql, queryParams);

        // Count Query (for pagination)
        // We reuse the params but remove limit/offset params
        const countSql = `
            SELECT COUNT(*) 
            FROM uploads u
            JOIN users us ON u.user_id = us.id
            ${whereClause}
        `;
        const countResult = await query(countSql, params);
        const totalCount = parseInt(countResult.rows[0].count);

        res.json({
            success: true,
            data: result.rows,
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                pages: Math.ceil(totalCount / limit)
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Search failed' });
    }
};
