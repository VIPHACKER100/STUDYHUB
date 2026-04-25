import { query } from '../config/database.js';
import cacheService from '../services/cacheService.js';

/**
 * @route   GET /api/recommendations
 * @desc    Get personalized content recommendations
 * @access  Private
 */
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `recommendations:user:${userId}`;

        const cached = await cacheService.get(cacheKey);
        if (cached) return res.json({ success: true, data: cached, fromCache: true });

        // 1. Get user's most downloaded subjects
        const userInterests = await query(`
            SELECT u.subject, COUNT(*) as interaction_count
            FROM uploads u
            JOIN downloads d ON d.upload_id = u.id
            WHERE d.user_id = $1
            GROUP BY u.subject
            ORDER BY interaction_count DESC
            LIMIT 3
        `, [userId]);

        let recommendations = [];

        if (userInterests.rows.length > 0) {
            // 2. Recommend based on interests
            const subjects = userInterests.rows.map(r => r.subject);
            const interestBased = await query(`
                SELECT u.*, us.username as uploader_name
                FROM uploads u
                JOIN users us ON us.id = u.user_id
                WHERE u.subject = ANY($1)
                AND u.user_id != $2
                AND u.is_deleted = FALSE
                AND u.id NOT IN (SELECT upload_id FROM downloads WHERE user_id = $2)
                ORDER BY u.average_rating DESC, u.download_count DESC
                LIMIT 6
            `, [subjects, userId]);
            
            recommendations = interestBased.rows;
        }

        // 3. If not enough recommendations, add trending content
        if (recommendations.length < 6) {
            const excludeIds = recommendations.length > 0 ? recommendations.map(r => r.id) : ['00000000-0000-0000-0000-000000000000'];
            const trending = await query(`
                SELECT u.*, us.username as uploader_name
                FROM uploads u
                JOIN users us ON us.id = u.user_id
                WHERE u.is_deleted = FALSE
                AND u.user_id != $1
                AND u.id != ALL($2)
                AND u.id NOT IN (SELECT upload_id FROM downloads WHERE user_id = $1)
                ORDER BY u.download_count DESC, u.average_rating DESC
                LIMIT $3
            `, [userId, excludeIds, 6 - recommendations.length]);
            
            recommendations = [...recommendations, ...trending.rows];
        }

        // 4. Map to camelCase
        const data = recommendations.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            subject: r.subject,
            type: r.type,
            uploaderName: r.uploader_name,
            downloadCount: r.download_count,
            averageRating: parseFloat(r.average_rating),
            createdAt: r.created_at
        }));

        await cacheService.set(cacheKey, data, 3600); // 1 hour TTL
        res.json({ success: true, data });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @route   GET /api/recommendations/trending
 * @desc    Get globally trending content
 * @access  Public
 */
export const getTrending = async (req, res) => {
    try {
        const cacheKey = 'recommendations:trending';
        const cached = await cacheService.get(cacheKey);
        if (cached) return res.json({ success: true, data: cached, fromCache: true });

        const result = await query(`
            SELECT u.*, us.username as uploader_name
            FROM uploads u
            JOIN users us ON us.id = u.user_id
            WHERE u.is_deleted = FALSE
            ORDER BY u.download_count DESC, u.average_rating DESC
            LIMIT 10
        `);

        const data = result.rows.map(r => ({
            id: r.id,
            title: r.title,
            subject: r.subject,
            type: r.type,
            uploaderName: r.uploader_name,
            downloadCount: r.download_count,
            averageRating: parseFloat(r.average_rating)
        }));

        await cacheService.set(cacheKey, data, 1800); // 30 min TTL
        res.json({ success: true, data });
    } catch (error) {
        console.error('Trending error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
