import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * User Model
 * Handles all user-related database operations
 */
class User {
    /**
     * Create a new user
     */
    static async create({ username, email, password, role, fullName }) {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await query(
            `INSERT INTO users (username, email, password_hash, role, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, role, full_name, is_verified, created_at`,
            [username, email, passwordHash, role, fullName]
        );

        return result.rows[0];
    }

    /**
     * Find user by ID
     */
    static async findById(id) {
        const result = await query(
            `SELECT id, username, email, role, full_name, avatar_url, bio, 
              is_verified, is_active, last_login, created_at
       FROM users WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    /**
     * Find user by email
     */
    static async findByEmail(email) {
        const result = await query(
            `SELECT id, username, email, password_hash, role, full_name, 
              avatar_url, is_verified, is_active
       FROM users WHERE email = $1`,
            [email]
        );

        return result.rows[0];
    }

    /**
     * Find user by email or username
     */
    static async findByIdentifier(identifier) {
        const result = await query(
            `SELECT id, username, email, password_hash, role, full_name, 
              avatar_url, is_verified, is_active
       FROM users WHERE email = $1 OR username = $1`,
            [identifier]
        );

        return result.rows[0];
    }

    /**
     * Find user by username
     */
    static async findByUsername(username) {
        const result = await query(
            `SELECT id, username, email, password_hash, role, full_name,
              avatar_url, bio, is_verified, is_active, created_at
       FROM users WHERE username = $1`,
            [username]
        );

        return result.rows[0];
    }

    /**
     * Verify password
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Generate JWT token
     */
    static generateToken(user) {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
    }

    /**
     * Update last login
     */
    /**
     * Update last login
     */
    static async updateLastLogin(userId) {
        await query(
            `UPDATE users SET last_login = NOW() WHERE id = $1`,
            [userId]
        );
    }

    /**
     * Create password reset token
     */
    static async createPasswordResetToken(userId, token, expiresAt) {
        await query(
            `INSERT INTO password_reset_tokens (user_id, token, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, token, expiresAt]
        );
    }

    /**
     * Find reset token
     */
    static async findResetToken(token) {
        const result = await query(
            `SELECT t.*, u.email, u.id as user_id
             FROM password_reset_tokens t
             JOIN users u ON t.user_id = u.id
             WHERE t.token = $1 AND t.expires_at > NOW()`,
            [token]
        );
        return result.rows[0];
    }

    /**
     * Delete reset token
     */
    static async deleteResetToken(token) {
        await query(
            `DELETE FROM password_reset_tokens WHERE token = $1`,
            [token]
        );
    }

    /**
     * Change Password
     */
    static async changePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [hashedPassword, userId]
        );
    }

    /**
     * Update user profile
     */
    static async updateProfile(userId, { fullName, bio, avatarUrl }) {
        const result = await query(
            `UPDATE users 
       SET full_name = COALESCE($2, full_name),
           bio = COALESCE($3, bio),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, username, email, role, full_name, bio, avatar_url`,
            [userId, fullName, bio, avatarUrl]
        );

        return result.rows[0];
    }

    /**
     * Change password
     */
    static async changePassword(userId, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await query(
            `UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1`,
            [userId, passwordHash]
        );
    }

    /**
     * Verify user email
     */
    static async verifyEmail(userId) {
        await query(
            `UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE id = $1`,
            [userId]
        );
    }

    /**
     * Get all users (admin only, with pagination)
     */
    static async getAll(page = 1, limit = 20, role = null) {
        const offset = (page - 1) * limit;

        let queryText = `
      SELECT id, username, email, role, full_name, avatar_url,
             is_verified, is_active, last_login, created_at
      FROM users
    `;

        const params = [];

        if (role) {
            queryText += ` WHERE role = $1`;
            params.push(role);
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        // Get total count
        const countResult = await query(
            role ? `SELECT COUNT(*) FROM users WHERE role = $1` : `SELECT COUNT(*) FROM users`,
            role ? [role] : []
        );

        return {
            users: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            pages: Math.ceil(countResult.rows[0].count / limit),
        };
    }

    /**
     * Delete user (soft delete by setting is_active = false)
     */
    static async delete(userId) {
        await query(
            `UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1`,
            [userId]
        );
    }

    /**
     * Search users by username or full name
     */
    static async search(searchTerm, limit = 10) {
        const result = await query(
            `SELECT id, username, full_name, avatar_url, role
       FROM users
       WHERE (username ILIKE $1 OR full_name ILIKE $1)
         AND is_active = TRUE
       LIMIT $2`,
            [`%${searchTerm}%`, limit]
        );

        return result.rows;
    }
    /**
     * Block a user
     */
    static async blockUser(blockerId, blockedId) {
        await query(
            `INSERT INTO blocked_users (blocker_id, blocked_id) 
             VALUES ($1, $2) 
             ON CONFLICT DO NOTHING`,
            [blockerId, blockedId]
        );
    }

    /**
     * Unblock a user
     */
    static async unblockUser(blockerId, blockedId) {
        await query(
            `DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`,
            [blockerId, blockedId]
        );
    }

    /**
     * Get blocked users
     */
    static async getBlockedUsers(userId) {
        const result = await query(
            `SELECT u.id, u.username, u.avatar_url 
             FROM blocked_users b
             JOIN users u ON b.blocked_id = u.id
             WHERE b.blocker_id = $1`,
            [userId]
        );
        return result.rows;
    }

    /**
     * Check if a user is blocked by another
     * Returns true if blockedId is blocked by blockerId
     */
    static async isBlocked(blockerId, blockedId) {
        const result = await query(
            `SELECT 1 FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`,
            [blockerId, blockedId]
        );
        return result.rows.length > 0;
    }
}

export default User;

