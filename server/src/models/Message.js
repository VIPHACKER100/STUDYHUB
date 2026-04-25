import { query } from '../config/database.js';

/**
 * Message Model
 * Handles direct messaging operations
 */
class Message {
    /**
     * Get or create conversation between two users
     */
    static async getOrCreateConversation(user1Id, user2Id) {
        // Ensure consistent ordering (smaller UUID first)
        const [userId1, userId2] = [user1Id, user2Id].sort();

        let result = await query(
            `SELECT * FROM direct_conversations 
       WHERE (user1_id = $1 AND user2_id = $2)
          OR (user1_id = $2 AND user2_id = $1)`,
            [userId1, userId2]
        );

        if (result.rows.length === 0) {
            // Create new conversation
            result = await query(
                `INSERT INTO direct_conversations (user1_id, user2_id)
         VALUES ($1, $2)
         RETURNING *`,
                [userId1, userId2]
            );
        }

        return result.rows[0];
    }

    /**
     * Get all conversations for a user
     */
    static async getUserConversations(userId) {
        const result = await query(
            `SELECT 
         c.*,
         CASE 
           WHEN c.user1_id = $1 THEN c.user2_id
           ELSE c.user1_id
         END as other_user_id,
         u.username, u.full_name, u.avatar_url,
         (SELECT COUNT(*) FROM direct_messages 
          WHERE conversation_id = c.id 
            AND sender_id != $1 
            AND is_read = FALSE
            AND is_deleted = FALSE) as unread_count,
         (SELECT message FROM direct_messages 
          WHERE conversation_id = c.id 
            AND is_deleted = FALSE
          ORDER BY created_at DESC LIMIT 1) as last_message
       FROM direct_conversations c
       JOIN users u ON u.id = CASE 
         WHEN c.user1_id = $1 THEN c.user2_id
         ELSE c.user1_id
       END
       WHERE c.user1_id = $1 OR c.user2_id = $1
       ORDER BY c.last_message_at DESC NULLS LAST`,
            [userId]
        );

        return result.rows;
    }

    /**
     * Send a direct message
     */
    static async sendMessage({ conversationId, senderId, message, attachmentUrl, attachmentType, replyToId }) {
        const result = await query(
            `INSERT INTO direct_messages 
       (conversation_id, sender_id, message, attachment_url, attachment_type, reply_to_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [conversationId, senderId, message, attachmentUrl, attachmentType, replyToId]
        );

        // Update conversation's last_message_at
        await query(
            `UPDATE direct_conversations 
       SET last_message_at = NOW() 
       WHERE id = $1`,
            [conversationId]
        );

        return result.rows[0];
    }

    /**
     * Get messages for a conversation
     */
    static async getConversationMessages(conversationId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;

        const result = await query(
            `SELECT m.*, u.username, u.avatar_url as sender_avatar
       FROM direct_messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1 
         AND m.is_deleted = FALSE
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
            [conversationId, limit, offset]
        );

        return result.rows.reverse(); // Return in chronological order
    }

    /**
     * Mark messages as read
     */
    static async markAsRead(conversationId, userId) {
        await query(
            `UPDATE direct_messages
       SET is_read = TRUE
       WHERE conversation_id = $1 
         AND sender_id != $2
         AND is_read = FALSE`,
            [conversationId, userId]
        );
    }

    /**
     * Edit a message
     */
    static async editMessage(messageId, senderId, newMessage) {
        const result = await query(
            `UPDATE direct_messages
       SET message = $3, is_edited = TRUE, updated_at = NOW()
       WHERE id = $1 AND sender_id = $2
       RETURNING *`,
            [messageId, senderId, newMessage]
        );

        return result.rows[0];
    }

    /**
     * Delete a message (soft delete)
     */
    static async deleteMessage(messageId, senderId) {
        const result = await query(
            `UPDATE direct_messages
       SET is_deleted = TRUE, updated_at = NOW()
       WHERE id = $1 AND sender_id = $2
       RETURNING *`,
            [messageId, senderId]
        );

        return result.rows[0];
    }

    /**
     * Get unread message count for user
     */
    static async getUnreadCount(userId) {
        const result = await query(
            `SELECT COUNT(*) as count
       FROM direct_messages dm
       JOIN direct_conversations dc ON dm.conversation_id = dc.id
       WHERE (dc.user1_id = $1 OR dc.user2_id = $1)
         AND dm.sender_id != $1
         AND dm.is_read = FALSE
         AND dm.is_deleted = FALSE`,
            [userId]
        );

        return parseInt(result.rows[0].count);
    }
    /**
     * Get conversation by ID
     */
    static async getConversationById(conversationId) {
        const result = await query(
            `SELECT * FROM direct_conversations WHERE id = $1`,
            [conversationId]
        );
        return result.rows[0];
    }
}

export default Message;
