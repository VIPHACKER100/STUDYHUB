import express from 'express';
import {
    getConversations,
    getMessages,
    sendMessage,
    markAsRead,
    uploadAttachment,
    deleteMessage,
    getUnreadCount
} from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/auth.js';
import upload from '../middleware/upload.js'; // Assuming you have this

const router = express.Router();

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadAttachment);
router.get('/conversations', getConversations);
router.get('/conversations/:userId', getConversations); // Get or create
router.get('/:conversationId', getMessages);
router.post('/send', sendMessage);
router.put('/:messageId/read', markAsRead);
router.delete('/:messageId', deleteMessage);
router.get('/unread/count', getUnreadCount);

export default router;

