import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { summarizeUpload } from '../controllers/aiController.js';

const router = express.Router();

router.post('/summarize/:uploadId', authMiddleware, summarizeUpload);

export default router;

