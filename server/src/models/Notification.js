import { query } from '../config/database.js';

class Notification {
    static async create({ userId, type, title, message, linkUrl, relatedId, senderId, priority = 'normal' }) {
        const result = await query(
            `INSERT INTO notifications 
       (user_id, type, title, message, link_url, related_id, sender_id, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [userId, type, title, message, linkUrl, relatedId, senderId, priority]
        );
        return result.rows[0];
    }

    static async getForUser(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        // Get notifications
        const result = await query(
            `SELECT n.*, 
              s.username as sender_username, 
              s.avatar_url as sender_avatar
       FROM notifications n
       LEFT JOIN users s ON n.sender_id = s.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        // Get unread count
        const countResult = await query(
            `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
            [userId]
        );

        return {
            notifications: result.rows,
            unreadCount: parseInt(countResult.rows[0].count),
        };
    }

    static async markAsRead(notificationId, userId) {
        const result = await query(
            `UPDATE notifications 
       SET is_read = TRUE 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [notificationId, userId]
        );
        return result.rows[0];
    }

    static async markAllAsRead(userId) {
        await query(
            `UPDATE notifications 
       SET is_read = TRUE 
       WHERE user_id = $1 AND is_read = FALSE`,
            [userId]
        );
        return true;
    }

    static async delete(notificationId, userId) {
        await query(
            `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
            [notificationId, userId]
        );
        return true;
    }
    static async getRecentUnread() {
        const result = await query(
            `SELECT n.*, u.email, u.username 
             FROM notifications n
             JOIN users u ON n.user_id = u.id
             WHERE n.is_read = FALSE 
               AND n.created_at >= NOW() - INTERVAL '24 HOURS'
               AND u.is_active = TRUE
             ORDER BY n.user_id, n.created_at DESC`
        );
        return result.rows;
    }
}

export default Notification;

