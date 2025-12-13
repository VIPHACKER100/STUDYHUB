import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './index.js';

/**
 * Initialize Socket.io server with authentication
 */
export function initializeSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: config.socket.corsOrigin,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Authentication middleware for Socket.io
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, config.jwt.secret);
            socket.user = decoded; // Attach user data to socket
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    // Connection handler
    io.on('connection', (socket) => {
        console.log(`✓ User connected: ${socket.user.username} (${socket.user.id})`);

        // Join user-specific room for private notifications
        socket.join(`user:${socket.user.id}`);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`✗ User disconnected: ${socket.user.username}`);
        });
    });

    return io;
}

export default initializeSocket;
