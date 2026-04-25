import Redis from 'ioredis';
import config from '../config/index.js';

class CacheService {
    constructor() {
        this.client = null;
        this.isConnected = false;

        if (config.redis.host) {
            this.client = new Redis({
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.password,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
            });

            this.client.on('connect', () => {
                this.isConnected = true;
                console.log('✅ Redis Cache - Connected');
            });

            this.client.on('error', (err) => {
                this.isConnected = false;
                console.error('❌ Redis Cache - Error:', err.message);
            });
        } else {
            console.warn('⚠️ Redis Cache - Not configured: host missing');
        }
    }

    /**
     * Set a value in cache
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttl - Time to live in seconds (default 1 hour)
     */
    async set(key, value, ttl = 3600) {
        if (!this.isConnected || !this.client) return null;
        try {
            const stringValue = JSON.stringify(value);
            await this.client.set(key, stringValue, 'EX', ttl);
            return true;
        } catch (error) {
            console.error(`Redis Set Error (${key}):`, error);
            return null;
        }
    }

    /**
     * Get a value from cache
     * @param {string} key 
     */
    async get(key) {
        if (!this.isConnected || !this.client) return null;
        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis Get Error (${key}):`, error);
            return null;
        }
    }

    /**
     * Delete a key from cache
     * @param {string} key 
     */
    async del(key) {
        if (!this.isConnected || !this.client) return null;
        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error(`Redis Del Error (${key}):`, error);
            return null;
        }
    }

    /**
     * Delete keys matching a pattern
     * @param {string} pattern 
     */
    async delPattern(pattern) {
        if (!this.isConnected || !this.client) return null;
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
            return true;
        } catch (error) {
            console.error(`Redis DelPattern Error (${pattern}):`, error);
            return null;
        }
    }

    /**
     * Flush all cache
     */
    async flush() {
        if (!this.isConnected || !this.client) return null;
        try {
            await this.client.flushall();
            return true;
        } catch (error) {
            console.error('Redis Flush Error:', error);
            return null;
        }
    }
}

export default new CacheService();
