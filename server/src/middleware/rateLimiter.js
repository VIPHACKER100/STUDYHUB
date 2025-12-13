import rateLimit from 'express-rate-limit';

const createLimiter = (options) => {
    if (process.env.NODE_ENV === 'test') {
        return (req, res, next) => next();
    }
    return rateLimit(options);
};

// Global API limiter
export const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// Stricter limiter for auth routes (brute force protection)
export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per 15 min
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes'
    }
});

// Upload limiter (prevent DOS via file uploads)
export const uploadLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 100 uploads per hour
    message: {
        success: false,
        message: 'Upload limit reached, please try again later'
    }
});
