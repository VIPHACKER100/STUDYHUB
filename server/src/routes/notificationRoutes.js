import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllRead,
    deleteNotification,
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllRead);
router.delete('/:id', deleteNotification);

export default router;
