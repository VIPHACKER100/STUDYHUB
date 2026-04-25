import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import emailService from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Authentication Controller
 * Handles user registration, login, and profile operations
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = [
    // Validation rules
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('fullName')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Full name cannot exceed 100 characters'),

    body('role')
        .isIn(['student', 'teacher'])
        .withMessage('Role must be either student or teacher'),

    // Handler
    async (req, res) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            const { username, email, password, fullName, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered',
                });
            }

            const existingUsername = await User.findByUsername(username);
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken',
                });
            }

            // Create user
            const user = await User.create({
                username,
                email,
                password,
                role,
                fullName,
            });

            // Generate token
            const token = User.generateToken(user);

            // Send verification email
            const verificationToken = jwt.sign(
                { id: user.id, purpose: 'email_verification' },
                config.jwt.secret,
                { expiresIn: '24h' }
            );

            try {
                await emailService.sendVerificationEmail(user, verificationToken);
            } catch (emailErr) {
                console.error('Failed to send verification email', emailErr);
            }

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please check your email to verify your account.',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        fullName: user.full_name,
                        isVerified: user.is_verified,
                    },
                    token,
                },
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration',
            });
        }
    },
];

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = [
    // Validation
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    // Handler
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Check if account is active
            if (!user.is_active) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated. Please contact support.',
                });
            }

            // Verify password
            const isValidPassword = await User.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Update last login
            await User.updateLastLogin(user.id);

            // Generate token
            const token = User.generateToken(user);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        fullName: user.full_name,
                        avatarUrl: user.avatar_url,
                        isVerified: user.is_verified,
                    },
                    token,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login',
            });
        }
    },
];

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    fullName: user.full_name,
                    avatarUrl: user.avatar_url,
                    bio: user.bio,
                    isVerified: user.is_verified,
                    createdAt: user.created_at,
                },
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = [
    body('fullName').optional().trim().isLength({ max: 100 }),
    body('bio').optional().trim().isLength({ max: 500 }),
    body('avatarUrl').optional().trim().isURL(),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { fullName, bio, avatarUrl } = req.body;

            const updatedUser = await User.updateProfile(req.user.id, {
                fullName,
                bio,
                avatarUrl,
            });

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: { user: updatedUser },
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    },
];

/**
 * @route   PUT /api/auth/password
 * @desc    Change password
 * @access  Private
 */
export const changePassword = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { currentPassword, newPassword } = req.body;

            // Get user with password hash
            const user = await User.findByEmail(req.user.email);

            // Verify current password
            const isValid = await User.verifyPassword(currentPassword, user.password_hash);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect',
                });
            }

            // Change password
            await User.changePassword(req.user.id, newPassword);

            res.json({
                success: true,
                message: 'Password changed successfully',
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    },
];

/**
 * @route   GET /api/auth/search
 * @desc    Search users
 * @access  Private
 */
export const searchUsers = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters',
            });
        }

        const users = await User.search(q, parseInt(limit));

        res.json({
            success: true,
            data: { users },
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (userId === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot block yourself' });
        }
        await User.blockUser(req.user.id, userId);
        res.json({ success: true, message: 'User blocked' });
    } catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.unblockUser(req.user.id, userId);
        res.json({ success: true, message: 'User unblocked' });
    } catch (error) {
        console.error('Unblock user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBlockedUsers = async (req, res) => {
    try {
        const users = await User.getBlockedUsers(req.user.id);
        res.json({ success: true, data: { users } });
    } catch (error) {
        console.error('Get blocked users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }

        try {
            const decoded = jwt.verify(token, config.jwt.secret);
            if (decoded.purpose !== 'email_verification') {
                return res.status(400).json({ success: false, message: 'Invalid token type' });
            }

            await User.verifyEmail(decoded.id);

            res.json({ success: true, message: 'Email verified successfully' });
        } catch (err) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            // Check security best practices: delay or generic message?
            // For MVP, generic message "If email exists..." is good, or specific "User not found"
            // Let's go with "If your email is registered, you will receive a reset link" to prevent enumeration
            return res.json({ success: true, message: 'If your email is registered, you will receive a reset link.' });
        }

        // Generate token (crypto.randomBytes)
        // We'll use uuid for simplicity given we have uuid-ossp or standard crypto
        const { v4: uuidv4 } = await import('uuid');
        const token = uuidv4(); // Or use crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await User.createPasswordResetToken(user.id, token, expiresAt);

        try {
            await emailService.sendPasswordResetEmail(user, token);
        } catch (emailErr) {
            console.error('Failed to send reset email', emailErr);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }

        res.json({ success: true, message: 'If your email is registered, you will receive a reset link.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const resetToken = await User.findResetToken(token);
        if (!resetToken) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        await User.changePassword(resetToken.user_id, newPassword);
        await User.deleteResetToken(token);

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
