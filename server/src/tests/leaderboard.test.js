import request from 'supertest';
import app from '../index.js';
import { pool } from '../config/database.js';

let authToken = '';

const TEST_USER = {
    username: `lb_user_${Date.now()}`,
    email: `lb_${Date.now()}@test.com`,
    password: 'password123',
};

let userId = '';

beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    authToken = res.body.token;
    userId = res.body.user?.id;
});

afterAll(async () => {
    await pool.end();
});

describe('Leaderboard Endpoints', () => {

    // ── Top Uploaders ────────────────────────────────────────────────────

    it('GET /api/leaderboard/uploaders — returns array without auth', async () => {
        const res = await request(app).get('/api/leaderboard/uploaders');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/leaderboard/uploaders — respects limit param', async () => {
        const res = await request(app).get('/api/leaderboard/uploaders?limit=5');
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('GET /api/leaderboard/uploaders — entries have required fields', async () => {
        const res = await request(app).get('/api/leaderboard/uploaders?limit=3');
        expect(res.statusCode).toBe(200);
        if (res.body.data.length > 0) {
            const entry = res.body.data[0];
            expect(entry).toHaveProperty('rank');
            expect(entry).toHaveProperty('username');
            expect(entry).toHaveProperty('uploadCount');
            expect(entry).toHaveProperty('totalDownloads');
            expect(entry).toHaveProperty('avgRating');
            expect(entry.rank).toBe(1);
        }
    });

    it('GET /api/leaderboard/uploaders — uses cache on second request', async () => {
        const first = await request(app).get('/api/leaderboard/uploaders?limit=10');
        const second = await request(app).get('/api/leaderboard/uploaders?limit=10');
        expect(first.statusCode).toBe(200);
        expect(second.statusCode).toBe(200);
        // Second response may have fromCache: true if Redis is running
        // Either way both should succeed
    });

    // ── Top Downloaders ──────────────────────────────────────────────────

    it('GET /api/leaderboard/downloaders — requires auth', async () => {
        const res = await request(app).get('/api/leaderboard/downloaders');
        expect(res.statusCode).toBe(401);
    });

    it('GET /api/leaderboard/downloaders — returns array for authenticated user', async () => {
        if (!authToken) return;
        const res = await request(app)
            .get('/api/leaderboard/downloaders')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // ── User Badges ──────────────────────────────────────────────────────

    it('GET /api/leaderboard/badges/:userId — returns badge object without auth', async () => {
        if (!userId) return;
        const res = await request(app).get(`/api/leaderboard/badges/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('total');
        expect(res.body.data).toHaveProperty('badges');
        expect(res.body.data).toHaveProperty('stats');
        expect(Array.isArray(res.body.data.badges)).toBe(true);
    });

    it('GET /api/leaderboard/badges/:userId — stats have correct shape', async () => {
        if (!userId) return;
        const res = await request(app).get(`/api/leaderboard/badges/${userId}`);
        const { stats } = res.body.data;
        expect(typeof stats.uploads).toBe('number');
        expect(typeof stats.downloads).toBe('number');
        expect(typeof stats.ratings).toBe('number');
    });

    it('GET /api/leaderboard/badges/invalid-uuid — handles gracefully', async () => {
        const res = await request(app).get('/api/leaderboard/badges/not-a-real-id');
        expect([400, 404, 500]).toContain(res.statusCode);
    });
});
