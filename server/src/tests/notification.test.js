import request from 'supertest';
import app from '../index.js';
import { pool } from '../config/database.js';

let authToken = '';

const TEST_USER = {
    username: `notify_user_${Date.now()}`,
    email: `notify_${Date.now()}@test.com`,
    password: 'password123',
};

beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    authToken = res.body.token;
});

afterAll(async () => {
    await pool.end();
});

describe('Notification Endpoints', () => {

    it('GET /api/notifications — requires auth', async () => {
        const res = await request(app).get('/api/notifications');
        expect(res.statusCode).toBe(401);
    });

    it('GET /api/notifications — returns array for authenticated user', async () => {
        if (!authToken) return;
        const res = await request(app)
            .get('/api/notifications')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.notifications)).toBe(true);
    });

    it('GET /api/notifications/unread-count — returns count', async () => {
        if (!authToken) return;
        const res = await request(app)
            .get('/api/notifications/unread-count')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('count');
        expect(typeof res.body.data.count).toBe('number');
    });

    it('PUT /api/notifications/read-all — marks all read', async () => {
        if (!authToken) return;
        const res = await request(app)
            .put('/api/notifications/read-all')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('Unread count is 0 after read-all', async () => {
        if (!authToken) return;
        const res = await request(app)
            .get('/api/notifications/unread-count')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.body.data.count).toBe(0);
    });
});

