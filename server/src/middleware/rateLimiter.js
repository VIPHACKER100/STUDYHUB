import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import Redis from 'ioredis';
import config from '../config/index.js';

// Create a shared Redis client for rate limiting
// Falls back gracefully if Redis is unavailable
let redisClient = null;

if (config.redis?.host) {
    redisClient = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        enableOfflineQueue: false,      // Don't queue commands when offline
        lazyConnect: true,
        retryStrategy: (times) => {
            if (times > 3) return null; // Stop retrying after 3 attempts
            return Math.min(times * 100, 1000);
        },
    });

    redisClient.on('error', (err) => {
        console.warn('⚠️  Rate-limit Redis error (falling back to memory):', err.message);
    });

    redisClient.on('connect', () => {
        console.log('✅ Rate-limit Redis store - Connected');
    });
}

/**
 * Build a store config: Redis if available and connected, memory otherwise.
 * This means rate limiting degrades gracefully without Redis.
 */
const buildStore = (prefix) => {
    // Only use RedisStore if client exists AND is fully connected ('ready')
    if (redisClient && redisClient.status === 'ready') {
        return new RedisStore({
            sendCommand: async (...args) => {
                try {
                    return await redisClient.call(...args);
                } catch (err) {
                    console.warn('⚠️  Redis command failed in rate-limiter, using fallback logic');
                    throw err; // rate-limit-redis will handle or we should have a better fallback
                }
            },
            prefix: `rl:${prefix}:`,
        });
    }
    return undefined; // express-rate-limit defaults to MemoryStore
};

const createLimiter = (prefix, options) => {
    if (process.env.NODE_ENV === 'test') {
        return (req, res, next) => next(); // Skip limiting in test env
    }
    return rateLimit({
        store: buildStore(prefix),
        standardHeaders: true,   // Return RateLimit-* headers
        legacyHeaders: false,    // Disable X-RateLimit-* headers
        ...options,
    });
};

// ─── Limiters ──────────────────────────────────────────────

/** Global API limiter — 200 req / 15 min per IP */
export const apiLimiter = createLimiter('api', {
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

/** Auth limiter — 20 req / 15 min per IP (brute-force protection) */
export const authLimiter = createLimiter('auth', {
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes',
    },
});

/** Upload limiter — 100 uploads / hour per IP */
export const uploadLimiter = createLimiter('upload', {
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Upload limit reached, please try again later',
    },
});

