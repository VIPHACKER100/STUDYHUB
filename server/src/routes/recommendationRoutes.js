import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getRecommendations, getTrending } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/', authMiddleware, getRecommendations);
router.get('/trending', getTrending);

export default router;
