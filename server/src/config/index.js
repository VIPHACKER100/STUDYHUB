import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'notes_platform',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    // CORS
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    // File Upload
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800, // 50MB
        uploadDir: process.env.UPLOAD_DIR || './uploads',
    },

    // AWS S3 (optional)
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        s3Bucket: process.env.AWS_S3_BUCKET,
    },

    // Email
    email: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        from: process.env.EMAIL_FROM || 'noreply@notesplatform.com',
    },

    // Redis
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
    },

    // Socket.io
    socket: {
        corsOrigin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    },

    // AI & Intelligence
    ai: {
        geminiKey: process.env.GEMINI_API_KEY,
    },
};

export default config;

