import express from 'express';
import { getProfile, getUserUploads } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:username', getProfile);
router.get('/:username/uploads', getUserUploads);

export default router;
