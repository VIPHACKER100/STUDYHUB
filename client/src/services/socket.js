import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(token) {
        if (this.socket?.connected) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Message events
    joinConversation(conversationId) {
        this.emit('join_conversation', conversationId);
    }

    leaveConversation(conversationId) {
        this.emit('leave_conversation', conversationId);
    }

    sendMessage(data) {
        this.emit('send_message', data);
    }

    onNewMessage(callback) {
        this.on('new_message', callback);
    }

    onUserTyping(callback) {
        this.on('user_typing', callback);
    }

    onUserStoppedTyping(callback) {
        this.on('user_stopped_typing', callback);
    }

    markRead(conversationId) {
        this.emit('mark_read', { conversationId });
    }

    // Room events
    joinRoom(roomId) {
        this.emit('join_room', roomId);
    }

    leaveRoom(roomId) {
        this.emit('leave_room', roomId);
    }

    sendRoomMessage(data) {
        this.emit('room_message', data);
    }

    onRoomJoined(callback) {
        this.on('room_joined', callback);
    }

    onRoomNewMessage(callback) {
        this.on('room_new_message', callback);
    }

    onUserJoinedRoom(callback) {
        this.on('user_joined', callback);
    }

    onUserLeftRoom(callback) {
        this.on('user_left', callback);
    }

    // Typing indicators
    startTyping(conversationId) {
        this.emit('typing_start', conversationId);
    }

    stopTyping(conversationId) {
        this.emit('typing_stop', conversationId);
    }

    // Generic event handlers
    emit(event, data) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);

            // Store listener for cleanup
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);

            // Remove from stored listeners
            if (this.listeners.has(event)) {
                const callbacks = this.listeners.get(event);
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }

    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.listeners.clear();
        }
    }
}

const socketService = new SocketService();
export default socketService;



