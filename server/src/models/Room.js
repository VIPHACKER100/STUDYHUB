import { query } from '../config/database.js';

/**
 * Generate random anonymous name
 */
const ADJECTIVES = [
    'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown',
    'Gray', 'Silver', 'Golden', 'Azure', 'Crimson', 'Emerald', 'Violet',
    'Turquoise', 'Amber', 'Indigo', 'Coral', 'Teal'
];

const ANIMALS = [
    'Panda', 'Tiger', 'Lion', 'Eagle', 'Dolphin', 'Fox', 'Wolf', 'Bear',
    'Owl', 'Hawk', 'Raven', 'Falcon', 'Phoenix', 'Dragon', 'Unicorn',
    'Penguin', 'Koala', 'Lemur', 'Otter', 'Beaver', 'Rabbit', 'Deer'
];

function generateAnonymousId() {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${adjective} ${animal} ${number}`;
}

/**
 * Room Model
 * Handles anonymous chat room operations
 */
class Room {
    /**
     * Create a new anonymous room
     */
    static async create({ name, description, subject, tags, roomType, creatorId, isPublic, isTemporary, maxParticipants, expiresAt }) {
        const result = await query(
            `INSERT INTO anonymous_rooms 
       (name, description, subject, tags, room_type, creator_id, is_public, is_temporary, max_participants, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [name, description, subject, tags, roomType, creatorId, isPublic, isTemporary, maxParticipants, expiresAt]
        );

        return result.rows[0];
    }

    /**
     * Get all public active rooms
     */
    static async getPublicRooms(roomType = null) {
        let queryText = `
      SELECT r.*, 
             COUNT(DISTINCT s.user_id) FILTER (WHERE s.left_at IS NULL) as active_participants
      FROM anonymous_rooms r
      LEFT JOIN anonymous_sessions s ON r.id = s.room_id AND s.left_at IS NULL
      WHERE r.is_public = TRUE 
        AND r.is_active = TRUE
        AND (r.expires_at IS NULL OR r.expires_at > NOW())
    `;

        const params = [];
        if (roomType) {
            queryText += ` AND r.room_type = $1`;
            params.push(roomType);
        }

        queryText += ` GROUP BY r.id ORDER BY active_participants DESC, r.created_at DESC`;

        const result = await query(queryText, params);
        return result.rows;
    }

    /**
     * Get room by ID
     */
    static async getById(roomId) {
        const result = await query(
            `SELECT r.*,
              COUNT(DISTINCT s.user_id) FILTER (WHERE s.left_at IS NULL) as active_participants
       FROM anonymous_rooms r
       LEFT JOIN anonymous_sessions s ON r.id = s.room_id AND s.left_at IS NULL
       WHERE r.id = $1
       GROUP BY r.id`,
            [roomId]
        );

        return result.rows[0];
    }

    /**
     * Join a room
     */
    static async joinRoom(roomId, userId) {
        const anonymousId = generateAnonymousId();

        const result = await query(
            `INSERT INTO anonymous_sessions (room_id, user_id, anonymous_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [roomId, userId, anonymousId]
        );

        // Update participant count
        await query(
            `UPDATE anonymous_rooms 
       SET participant_count = (
         SELECT COUNT(DISTINCT user_id) 
         FROM anonymous_sessions 
         WHERE room_id = $1 AND left_at IS NULL
       )
       WHERE id = $1`,
            [roomId]
        );

        return result.rows[0];
    }

    /**
     * Leave a room
     */
    static async leaveRoom(roomId, userId) {
        await query(
            `UPDATE anonymous_sessions
       SET left_at = NOW()
       WHERE room_id = $1 AND user_id = $2 AND left_at IS NULL`,
            [roomId, userId]
        );

        // Update participant count
        await query(
            `UPDATE anonymous_rooms 
       SET participant_count = (
         SELECT COUNT(DISTINCT user_id) 
         FROM anonymous_sessions 
         WHERE room_id = $1 AND left_at IS NULL
       )
       WHERE id = $1`,
            [roomId]
        );
    }

    /**
     * Get user's active session in a room
     */
    static async getUserSession(roomId, userId) {
        const result = await query(
            `SELECT * FROM anonymous_sessions
       WHERE room_id = $1 AND user_id = $2 AND left_at IS NULL
       ORDER BY joined_at DESC
       LIMIT 1`,
            [roomId, userId]
        );

        return result.rows[0];
    }

    /**
     * Send message to room
     */
    static async sendMessage({ roomId, anonymousId, message, attachmentUrl }) {
        const result = await query(
            `INSERT INTO anonymous_messages (room_id, anonymous_id, message, attachment_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [roomId, anonymousId, message, attachmentUrl]
        );

        return result.rows[0];
    }

    /**
     * Get room messages
     */
    static async getRoomMessages(roomId, page = 1, limit = 50) {
        const offset = (page - 1) * limit;

        const result = await query(
            `SELECT * FROM anonymous_messages
       WHERE room_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
            [roomId, limit, offset]
        );

        return result.rows.reverse();
    }

    /**
     * Get active participants in a room
     */
    static async getActiveParticipants(roomId) {
        const result = await query(
            `SELECT anonymous_id, joined_at
       FROM anonymous_sessions
       WHERE room_id = $1 AND left_at IS NULL
       ORDER BY joined_at DESC`,
            [roomId]
        );

        return result.rows;
    }

    /**
     * Delete room (creator only)
     */
    static async delete(roomId, userId) {
        const result = await query(
            `UPDATE anonymous_rooms
       SET is_active = FALSE
       WHERE id = $1 AND creator_id = $2
       RETURNING *`,
            [roomId, userId]
        );

        return result.rows[0];
    }
}

export default Room;
export { generateAnonymousId };
