import Message from '../models/Message.js';
import User from '../models/User.js';

/**
 * Direct Messaging Controller
 */

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all conversations for current user
 * @access  Private
 */
export const getConversations = async (req, res) => {
    try {
        const conversations = await Message.getUserConversations(req.user.id);

        res.json({
            success: true,
            data: { conversations },
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/messages/conversation/:userId
 * @desc    Get or create conversation with another user
 * @access  Private
 */
export const getOrCreateConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot create conversation with yourself',
            });
        }

        const conversation = await Message.getOrCreateConversation(req.user.id, userId);

        res.json({
            success: true,
            data: { conversation },
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/messages/:conversationId
 * @desc    Get messages for a conversation
 * @access  Private
 */
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const messages = await Message.getConversationMessages(
            conversationId,
            parseInt(page),
            parseInt(limit)
        );

        // Mark messages as read
        await Message.markAsRead(conversationId, req.user.id);

        res.json({
            success: true,
            data: { messages },
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   POST /api/messages/send
 * @desc    Send a message
 * @access  Private
 */
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message, attachmentUrl, attachmentType, replyToId } = req.body;

        if (!message && !attachmentUrl) {
            return res.status(400).json({
                success: false,
                message: 'Message or attachment required',
            });
        }

        // Check if blocked
        const conversation = await Message.getConversationById(conversationId);

        if (conversation) {
            const { user1_id, user2_id } = conversation;
            const recipientId = user1_id === req.user.id ? user2_id : user1_id;

            // Check if sender is blocked by recipient
            const isBlocked = await User.isBlocked(recipientId, req.user.id);

            if (isBlocked) {
                return res.status(403).json({
                    success: false,
                    message: 'You cannot send messages to this user'
                });
            }
        }

        const newMessage = await Message.sendMessage({
            conversationId,
            senderId: req.user.id,
            message,
            attachmentUrl,
            attachmentType,
            replyToId,
        });

        // Emit via Socket.io (handled in socket handlers)
        req.io.to(`conversation:${conversationId}`).emit('new_message', newMessage);

        res.status(201).json({
            success: true,
            data: { message: newMessage },
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   PUT /api/messages/:messageId
 * @desc    Edit a message
 * @access  Private
 */
export const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { message } = req.body;

        const updatedMessage = await Message.editMessage(messageId, req.user.id, message);

        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found or unauthorized',
            });
        }

        res.json({
            success: true,
            data: { message: updatedMessage },
        });
    } catch (error) {
        console.error('Edit message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a message
 * @access  Private
 */
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await Message.deleteMessage(messageId, req.user.id);

        if (!deletedMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found or unauthorized',
            });
        }

        res.json({
            success: true,
            message: 'Message deleted',
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @route   GET /api/messages/unread/count
 * @desc    Get unread message count
 * @access  Private
 */
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.getUnreadCount(req.user.id);

        res.json({
            success: true,
            data: { count },
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
/**
 * @route   PUT /api/messages/conversations/:conversationId/read
 * @desc    Mark conversation as read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        await Message.markAsRead(conversationId, req.user.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @route   POST /api/messages/upload
 * @desc    Upload attachment
 * @access  Private
 */
export const uploadAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        // Assuming file upload middleware puts file in req.file
        // and we return the URL or path
        res.json({
            success: true,
            data: {
                url: `/uploads/${req.file.filename}`, // simplified
                type: req.file.mimetype,
                name: req.file.originalname
            }
        });
    } catch (error) {
        console.error('Upload attachment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

