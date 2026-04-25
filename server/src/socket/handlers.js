import Message from '../models/Message.js';
import Room from '../models/Room.js';

/**
 * Socket.io Event Handlers
 * Handles real-time messaging events
 */

/**
 * Setup message handlers for a Socket.io instance
 */
export function setupMessageHandlers(io, socket) {
    /**
     * Join a conversation room
     */
    socket.on('join_conversation', async (conversationId) => {
        try {
            socket.join(`conversation:${conversationId}`);
            console.log(`User ${socket.user.username} joined conversation: ${conversationId}`);
        } catch (error) {
            console.error('Join conversation error:', error);
        }
    });

    /**
     * Leave a conversation room
     */
    socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
        console.log(`User ${socket.user.username} left conversation: ${conversationId}`);
    });

    /**
     * Send a direct message (real-time)
     */
    socket.on('send_message', async (data) => {
        try {
            const { conversationId, message, attachmentUrl, attachmentType, replyToId } = data;

            // Save message to database
            const newMessage = await Message.sendMessage({
                conversationId,
                senderId: socket.user.id,
                message,
                attachmentUrl,
                attachmentType,
                replyToId,
            });

            // Get conversation to find recipient
            const conversation = await Message.getOrCreateConversation(socket.user.id, socket.user.id);

            // Emit to conversation room
            io.to(`conversation:${conversationId}`).emit('new_message', {
                ...newMessage,
                sender: {
                    id: socket.user.id,
                    username: socket.user.username,
                },
            });

            // Send acknowledgment
            socket.emit('message_sent', { success: true, message: newMessage });
        } catch (error) {
            console.error('Send message error:', error);
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    });

    /**
     * Typing indicator
     */
    socket.on('typing_start', (conversationId) => {
        socket.to(`conversation:${conversationId}`).emit('user_typing', {
            userId: socket.user.id,
            username: socket.user.username,
        });
    });

    socket.on('typing_stop', (conversationId) => {
        socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', {
            userId: socket.user.id,
        });
    });

    /**
     * Mark message as read
     */
    socket.on('mark_read', async ({ conversationId }) => {
        try {
            await Message.markAsRead(conversationId, socket.user.id);
            socket.to(`conversation:${conversationId}`).emit('messages_read', {
                userId: socket.user.id,
            });
        } catch (error) {
            console.error('Mark read error:', error);
        }
    });
}

/**
 * Setup room (anonymous chat) handlers
 */
export function setupRoomHandlers(io, socket) {
    /**
     * Join an anonymous room
     */
    socket.on('join_room', async (roomId) => {
        try {
            // Check if user has an active session
            let session = await Room.getUserSession(roomId, socket.user.id);

            if (!session) {
                // Create new session if not exists
                session = await Room.joinRoom(roomId, socket.user.id);
            }

            socket.join(`room:${roomId}`);

            // Notify room
            socket.to(`room:${roomId}`).emit('user_joined', {
                anonymousId: session.anonymous_id,
                timestamp: new Date(),
            });

            // Send confirmation to user
            socket.emit('room_joined', {
                roomId,
                anonymousId: session.anonymous_id,
                session,
            });

            console.log(`${session.anonymous_id} joined room: ${roomId}`);
        } catch (error) {
            console.error('Join room error:', error);
            socket.emit('room_error', { error: 'Failed to join room' });
        }
    });

    /**
     * Leave an anonymous room
     */
    socket.on('leave_room', async (roomId) => {
        try {
            const session = await Room.getUserSession(roomId, socket.user.id);

            if (session) {
                await Room.leaveRoom(roomId, socket.user.id);

                socket.leave(`room:${roomId}`);

                // Notify room
                socket.to(`room:${roomId}`).emit('user_left', {
                    anonymousId: session.anonymous_id,
                    timestamp: new Date(),
                });

                console.log(`${session.anonymous_id} left room: ${roomId}`);
            }
        } catch (error) {
            console.error('Leave room error:', error);
        }
    });

    /**
     * Send message to anonymous room
     */
    socket.on('room_message', async (data) => {
        try {
            const { roomId, message, attachmentUrl } = data;

            // Get user's session to get anonymous ID
            const session = await Room.getUserSession(roomId, socket.user.id);

            if (!session) {
                return socket.emit('room_error', { error: 'Not in room' });
            }

            // Save message
            const newMessage = await Room.sendMessage({
                roomId,
                anonymousId: session.anonymous_id,
                message,
                attachmentUrl,
            });

            // Broadcast to room
            io.to(`room:${roomId}`).emit('room_new_message', newMessage);

        } catch (error) {
            console.error('Room message error:', error);
            socket.emit('room_error', { error: 'Failed to send message' });
        }
    });

    /**
     * Get active participants in room
     */
    socket.on('get_room_participants', async (roomId) => {
        try {
            const participants = await Room.getActiveParticipants(roomId);
            socket.emit('room_participants', { roomId, participants });
        } catch (error) {
            console.error('Get participants error:', error);
        }
    });
}

/**
 * Setup online status handlers
 */
export function setupPresenceHandlers(io, socket) {
    // User is online
    socket.on('user_online', () => {
        socket.broadcast.emit('user_status_change', {
            userId: socket.user.id,
            status: 'online',
        });
    });

    // User is offline (on disconnect)
    socket.on('disconnect', () => {
        socket.broadcast.emit('user_status_change', {
            userId: socket.user.id,
            status: 'offline',
        });
    });
}

