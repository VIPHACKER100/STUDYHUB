import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import config from './config/index.js';
import routes from './routes/index.js';
import initializeSocket from './config/socket.js';
import { setupMessageHandlers, setupRoomHandlers, setupPresenceHandlers } from './socket/handlers.js';
import cronService from './services/cronService.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Setup Socket.io handlers
io.on('connection', (socket) => {
    setupMessageHandlers(io, socket);
    setupRoomHandlers(io, socket);
    setupPresenceHandlers(io, socket);
});

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
}));
app.use(compression()); // Middleware
// app.use(cors()); // Duplicate removed
app.use(express.json());

// Rate Limiting
import { apiLimiter, authLimiter, uploadLimiter } from './middleware/rateLimiter.js';
app.use('/api', apiLimiter);
// app.use('/api/auth', authLimiter); // Moved to specific routes
app.use('/api/uploads', uploadLimiter);
app.use('/api/messages/upload', uploadLimiter);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start server
const PORT = config.port;

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(PORT, () => {
        console.log('\n🚀 ════════════════════════════════════════════════════════');
        console.log('   StudyHub Platform - Server Started');
        console.log('  ════════════════════════════════════════════════════════');
        console.log(`\n  ➜  Server:      http://localhost:${PORT}`);
        console.log(`  ➜  API:         http://localhost:${PORT}/api`);
        console.log(`  ➜  Health:      http://localhost:${PORT}/api/health`);
        console.log(`  ➜  Environment: ${config.nodeEnv}`);
        console.log(`  ➜  Database:    ${config.database.name}`);
        console.log('\n  📡  Socket.io initialized for real-time messaging');

        // Initialize Cron Jobs
        cronService.init();

        console.log('\n  ⏳  Waiting for database connection...\n');
        console.log('════════════════════════════════════════════════════════\n');
    });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

export default app;
