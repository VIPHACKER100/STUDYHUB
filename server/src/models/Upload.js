import { query } from '../config/database.js';

/**
 * Upload Model
 * Handles file uploads (notes/assignments) operations
 */
class Upload {
    /**
     * Create new upload
     */
    static async create({ userId, title, description, subject, type, tags, filePath, fileName, fileSize, fileType }) {
        const result = await query(
            `INSERT INTO uploads 
       (user_id, title, description, subject, type, tags, file_path, file_name, file_size, file_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [userId, title, description, subject, type, tags, filePath, fileName, fileSize, fileType]
        );

        return result.rows[0];
    }

    /**
     * Get upload by ID
     */
    static async getById(uploadId) {
        const result = await query(
            `SELECT u.*, 
              us.username, us.full_name, us.role,
              (SELECT AVG(rating) FROM upload_ratings WHERE upload_id = u.id) as average_rating,
              (SELECT COUNT(*) FROM upload_ratings WHERE upload_id = u.id) as rating_count,
              (SELECT COUNT(*) FROM downloads WHERE upload_id = u.id) as download_count
       FROM uploads u
       JOIN users us ON u.user_id = us.id
       WHERE u.id = $1 AND u.is_deleted = FALSE`,
            [uploadId]
        );

        return result.rows[0];
    }

    /**
     * Get all uploads with filters and pagination
     */
    static async getAll({ type, subject, search, userId, privacy, page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'DESC' }) {
        const offset = (page - 1) * limit;
        let conditions = ['u.is_deleted = FALSE'];
        const params = [];
        let paramCount = 0;

        if (type) {
            paramCount++;
            conditions.push(`u.type = $${paramCount}`);
            params.push(type);
        }

        if (subject) {
            paramCount++;
            conditions.push(`u.subject = $${paramCount}`);
            params.push(subject);
        }

        if (userId) {
            paramCount++;
            conditions.push(`u.user_id = $${paramCount}`);
            params.push(userId);
        }

        if (privacy) {
            paramCount++;
            conditions.push(`u.privacy = $${paramCount}`);
            params.push(privacy);
        }

        if (search) {
            paramCount++;
            conditions.push(`(u.title ILIKE $${paramCount} OR u.description ILIKE $${paramCount} OR u.subject ILIKE $${paramCount})`);
            params.push(`%${search}%`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Validate sortBy to prevent SQL injection
        const allowedSortBy = ['created_at', 'title', 'download_count', 'average_rating'];
        const validSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'created_at';
        const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const result = await query(
            `SELECT u.*, 
              us.username, us.full_name, us.role,
              (SELECT AVG(rating) FROM upload_ratings WHERE upload_id = u.id) as average_rating,
              (SELECT COUNT(*) FROM upload_ratings WHERE upload_id = u.id) as rating_count,
              (SELECT COUNT(*) FROM downloads WHERE upload_id = u.id) as download_count
       FROM uploads u
       JOIN users us ON u.user_id = us.id
       ${whereClause}
       ORDER BY ${validSortBy} ${validSortOrder}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
            [...params, limit, offset]
        );

        // Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM uploads u ${whereClause}`,
            params
        );

        return {
            uploads: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        };
    }

    /**
     * Update upload
     */
    static async update(uploadId, userId, { title, description, subject, tags }) {
        const result = await query(
            `UPDATE uploads
       SET title = COALESCE($3, title),
           description = COALESCE($4, description),
           subject = COALESCE($5, subject),
           tags = COALESCE($6, tags),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [uploadId, userId, title, description, subject, tags]
        );

        return result.rows[0];
    }

    /**
     * Delete upload (soft delete)
     */
    static async delete(uploadId, userId) {
        const result = await query(
            `UPDATE uploads
       SET is_deleted = TRUE, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [uploadId, userId]
        );

        return result.rows[0];
    }

    /**
     * Admin delete (hard delete)
     */
    static async adminDelete(uploadId) {
        const result = await query(
            `UPDATE uploads
       SET is_deleted = TRUE, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
            [uploadId]
        );

        return result.rows[0];
    }

    /**
     * Track download
     */
    static async trackDownload(uploadId, userId) {
        await query(
            `INSERT INTO downloads (upload_id, user_id)
       VALUES ($1, $2)`,
            [uploadId, userId]
        );

        // Increment download count
        await query(
            `UPDATE uploads
       SET download_count = download_count + 1
       WHERE id = $1`,
            [uploadId]
        );
    }

    /**
     * Add rating
     */
    static async addRating(uploadId, userId, rating, comment) {
        // Check if user already rated
        const existing = await query(
            `SELECT id FROM upload_ratings WHERE upload_id = $1 AND user_id = $2`,
            [uploadId, userId]
        );

        let result;

        if (existing.rows.length > 0) {
            // Update existing rating
            result = await query(
                `UPDATE upload_ratings
         SET rating = $3, comment = $4, updated_at = NOW()
         WHERE upload_id = $1 AND user_id = $2
         RETURNING *`,
                [uploadId, userId, rating, comment]
            );
        } else {
            // Create new rating
            result = await query(
                `INSERT INTO upload_ratings (upload_id, user_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
                [uploadId, userId, rating, comment]
            );
        }

        // Recalculate and update stats (for both insert and update)
        await query(
            `UPDATE uploads 
             SET average_rating = (SELECT AVG(rating) FROM upload_ratings WHERE upload_id = $1),
                 rating_count = (SELECT COUNT(*) FROM upload_ratings WHERE upload_id = $1)
             WHERE id = $1`,
            [uploadId]
        );

        return result.rows[0];
    }

    /**
     * Get ratings for upload
     */
    static async getRatings(uploadId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const result = await query(
            `SELECT r.*, u.username, u.full_name, u.avatar_url
       FROM upload_ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.upload_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
            [uploadId, limit, offset]
        );

        return result.rows;
    }

    /**
     * Toggle bookmark
     */
    static async toggleBookmark(uploadId, userId) {
        // Check if already bookmarked
        const existing = await query(
            `SELECT id FROM bookmarks WHERE upload_id = $1 AND user_id = $2`,
            [uploadId, userId]
        );

        if (existing.rows.length > 0) {
            // Remove bookmark
            await query(
                `DELETE FROM bookmarks WHERE upload_id = $1 AND user_id = $2`,
                [uploadId, userId]
            );
            return { bookmarked: false };
        } else {
            // Add bookmark
            await query(
                `INSERT INTO bookmarks (upload_id, user_id) VALUES ($1, $2)`,
                [uploadId, userId]
            );
            return { bookmarked: true };
        }
    }

    /**
     * Get user's bookmarks
     */
    static async getUserBookmarks(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const result = await query(
            `SELECT u.*, b.created_at as bookmarked_at,
              us.username, us.full_name,
              (SELECT AVG(rating) FROM upload_ratings WHERE upload_id = u.id) as average_rating
       FROM bookmarks b
       JOIN uploads u ON b.upload_id = u.id
       JOIN users us ON u.user_id = us.id
       WHERE b.user_id = $1 AND u.is_deleted = FALSE
       ORDER BY b.created_at DESC
       LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        return result.rows;
    }
}

export default Upload;

