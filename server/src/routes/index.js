import express from 'express';
import authRoutes from './authRoutes.js';
import messageRoutes from './messageRoutes.js';
import roomRoutes from './roomRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import searchRoutes from './searchRoutes.js';
import adminRoutes from './adminRoutes.js';
import userRoutes from './userRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);
router.use('/rooms', roomRoutes);
router.use('/uploads', uploadRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/ai', aiRoutes);


// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

export default router;

