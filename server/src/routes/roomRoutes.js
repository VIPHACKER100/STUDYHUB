import express from 'express';
import {
    getRooms,
    createRoom,
    getRoom,
    joinRoom,
    leaveRoom,
    getRoomMessages,
    deleteRoom,
} from '../controllers/roomController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All room routes require authentication
router.use(authMiddleware);

router.get('/', getRooms);
router.post('/', createRoom);
router.get('/:roomId', getRoom);
router.post('/:roomId/join', joinRoom);
router.post('/:roomId/leave', leaveRoom);
router.get('/:roomId/messages', getRoomMessages);
router.delete('/:roomId', deleteRoom);

export default router;
