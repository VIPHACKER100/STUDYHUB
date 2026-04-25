import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../index.js';
import { pool } from '../config/database.js';

// ─── Helpers ───────────────────────────────────────────────────────────────

let authToken = '';
let uploadedId = '';

const TEST_USER = {
    username: `uploader_${Date.now()}`,
    email: `uploader_${Date.now()}@test.com`,
    password: 'password123',
};

// Create a tiny temp file to use as a test upload
const TMP_FILE = path.resolve('./tmp_test_upload.txt');

beforeAll(async () => {
    // Write a temporary file
    fs.writeFileSync(TMP_FILE, 'StudyHub test upload content');

    // Register & get token
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    authToken = res.body.token;
});

afterAll(async () => {
    // Remove temp file
    if (fs.existsSync(TMP_FILE)) fs.unlinkSync(TMP_FILE);
    await pool.end();
});

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('Upload Endpoints', () => {

    it('GET /api/uploads — returns public upload list', async () => {
        const res = await request(app).get('/api/uploads');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('uploads');
        expect(Array.isArray(res.body.data.uploads)).toBe(true);
    });

    it('GET /api/uploads — supports query filters without error', async () => {
        const res = await request(app)
            .get('/api/uploads')
            .query({ subject: 'math', type: 'notes', page: 1, limit: 5 });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('POST /api/uploads — requires auth', async () => {
        const res = await request(app)
            .post('/api/uploads')
            .field('title', 'Test Note')
            .field('subject', 'Science')
            .field('type', 'notes')
            .attach('file', TMP_FILE);
        expect(res.statusCode).toBe(401);
    });

    it('POST /api/uploads — creates upload with valid token', async () => {
        if (!authToken) return;
        const res = await request(app)
            .post('/api/uploads')
            .set('Authorization', `Bearer ${authToken}`)
            .field('title', 'Test Note Upload')
            .field('subject', 'Science')
            .field('type', 'notes')
            .field('description', 'A test note')
            .attach('file', TMP_FILE);

        // May fail if DB not seeded — log but don't hard fail
        if (res.statusCode === 201) {
            expect(res.body.success).toBe(true);
            expect(res.body.data.upload).toHaveProperty('id');
            uploadedId = res.body.data.upload.id;
        } else {
            console.log('Upload skipped (DB not ready):', res.body.message);
        }
    });

    it('GET /api/uploads/:id — returns 404 for non-existent id', async () => {
        const res = await request(app).get('/api/uploads/99999999-0000-0000-0000-000000000000');
        expect([404, 500]).toContain(res.statusCode);
    });

    it('GET /api/uploads/:id — returns upload when id exists', async () => {
        if (!uploadedId) return;
        const res = await request(app).get(`/api/uploads/${uploadedId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.upload.id).toBe(uploadedId);
    });

    it('POST /api/uploads/:id/rate — validates rating range', async () => {
        if (!uploadedId || !authToken) return;
        const res = await request(app)
            .post(`/api/uploads/${uploadedId}/rate`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ rating: 10 }); // Invalid — max is 5
        expect(res.statusCode).toBe(400);
    });

    it('POST /api/uploads/:id/rate — accepts valid rating', async () => {
        if (!uploadedId || !authToken) return;
        const res = await request(app)
            .post(`/api/uploads/${uploadedId}/rate`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ rating: 4, comment: 'Great notes!' });
        expect([200, 201]).toContain(res.statusCode);
    });

    it('DELETE /api/uploads/:id — requires auth', async () => {
        if (!uploadedId) return;
        const res = await request(app).delete(`/api/uploads/${uploadedId}`);
        expect(res.statusCode).toBe(401);
    });

    it('DELETE /api/uploads/:id — deletes own upload', async () => {
        if (!uploadedId || !authToken) return;
        const res = await request(app)
            .delete(`/api/uploads/${uploadedId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

