import express from 'express';
import {
    register,
    login,
    getMe,
    updateProfile,
    changePassword as updatePassword,
    searchUsers,
    blockUser,
    unblockUser,
    getBlockedUsers,
    verifyEmail,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { check } from 'express-validator';

const router = express.Router();

router.post('/register', [
    authLimiter,
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], register);

router.post('/verify-email', authLimiter, verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

router.post('/login', [
    authLimiter,
    check('identifier', 'Email or username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
], login);

router.use(authMiddleware);

router.get('/me', getMe);
router.put('/updatedetails', updateProfile);
router.put('/updatepassword', updatePassword);
router.get('/search', searchUsers); // ?q=query

// Block/Unblock routes
router.post('/block/:userId', blockUser);
router.delete('/block/:userId', unblockUser);
router.get('/blocked', getBlockedUsers);

export default router;

