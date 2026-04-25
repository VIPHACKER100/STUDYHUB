import Room from '../models/Room.js';
import { body, validationResult } from 'express-validator';

/**
 * Anonymous Room Controller
 */

/**
 * @route   GET /api/rooms
 * @desc    Get all public anonymous rooms
 * @access  Private
 */
export const getRooms = async (req, res) => {
    try {
        const { type } = req.query;
        const rooms = await Room.getPublicRooms(type);

        res.json({
            success: true,
            data: { rooms },
        });
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   POST /api/rooms
 * @desc    Create a new anonymous room
 * @access  Private
 */
export const createRoom = [
    body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Room name must be 3-100 characters'),
    body('description').optional().trim().isLength({ max: 500 }),
    body('subject').optional().trim().isLength({ max: 100 }),
    body('roomType').isIn(['study_group', 'assignment_help', 'exam_prep', 'general']),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { name, description, subject, tags, roomType, isPublic, isTemporary, maxParticipants, expiresAt } = req.body;

            const room = await Room.create({
                name,
                description,
                subject,
                tags: tags || [],
                roomType,
                creatorId: req.user.id,
                isPublic: isPublic !== false,
                isTemporary: isTemporary || false,
                maxParticipants: maxParticipants || 50,
                expiresAt,
            });

            res.status(201).json({
                success: true,
                message: 'Room created successfully',
                data: { room },
            });
        } catch (error) {
            console.error('Create room error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    },
];

/**
 * @route   GET /api/rooms/:roomId
 * @desc    Get room details
 * @access  Private
 */
export const getRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.getById(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found',
            });
        }

        res.json({
            success: true,
            data: { room },
        });
    } catch (error) {
        console.error('Get room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   POST /api/rooms/:roomId/join
 * @desc    Join an anonymous room
 * @access  Private
 */
export const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Check if room exists and is not full
        const room = await Room.getById(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found',
            });
        }

        if (room.active_participants >= room.max_participants) {
            return res.status(400).json({
                success: false,
                message: 'Room is full',
            });
        }

        // Check if user already in room
        const existingSession = await Room.getUserSession(roomId, req.user.id);
        if (existingSession) {
            return res.json({
                success: true,
                message: 'Already in room',
                data: { session: existingSession },
            });
        }

        const session = await Room.joinRoom(roomId, req.user.id);

        // Notify room via Socket.io
        req.io.to(`room:${roomId}`).emit('user_joined', {
            anonymousId: session.anonymous_id,
        });

        res.json({
            success: true,
            message: 'Joined room successfully',
            data: { session },
        });
    } catch (error) {
        console.error('Join room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   POST /api/rooms/:roomId/leave
 * @desc    Leave an anonymous room
 * @access  Private
 */
export const leaveRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        await Room.leaveRoom(roomId, req.user.id);

        // Notify room via Socket.io
        req.io.to(`room:${roomId}`).emit('user_left', {
            userId: req.user.id,
        });

        res.json({
            success: true,
            message: 'Left room successfully',
        });
    } catch (error) {
        console.error('Leave room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/rooms/:roomId/messages
 * @desc    Get room messages
 * @access  Private
 */
export const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const messages = await Room.getRoomMessages(roomId, parseInt(page), parseInt(limit));

        res.json({
            success: true,
            data: { messages },
        });
    } catch (error) {
        console.error('Get room messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   DELETE /api/rooms/:roomId
 * @desc    Delete a room (creator only)
 * @access  Private
 */
export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const deleted = await Room.delete(roomId, req.user.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Room not found or unauthorized',
            });
        }

        res.json({
            success: true,
            message: 'Room deleted successfully',
        });
    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
