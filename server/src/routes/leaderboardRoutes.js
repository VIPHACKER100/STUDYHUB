import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
    getTopUploaders,
    getTopDownloaders,
    getUserBadges,
} from '../controllers/leaderboardController.js';

const router = express.Router();

// Public endpoints
router.get('/uploaders',        getTopUploaders);
router.get('/badges/:userId',   getUserBadges);

// Auth required — shows personal download rank
router.get('/downloaders', authMiddleware, getTopDownloaders);

export default router;

