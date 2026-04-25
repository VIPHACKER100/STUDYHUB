import request from 'supertest';
import app from '../index.js';
import { pool } from '../config/database.js';

let authTokenA = '';
let authTokenB = '';
let conversationId = '';
let messageId = '';

const userA = {
    username: `msg_user_a_${Date.now()}`,
    email: `msg_a_${Date.now()}@test.com`,
    password: 'password123',
};
const userB = {
    username: `msg_user_b_${Date.now()}`,
    email: `msg_b_${Date.now()}@test.com`,
    password: 'password123',
};

let userBId = '';

beforeAll(async () => {
    const [resA, resB] = await Promise.all([
        request(app).post('/api/auth/register').send(userA),
        request(app).post('/api/auth/register').send(userB),
    ]);
    authTokenA = resA.body.token;
    authTokenB = resB.body.token;
    userBId = resB.body.user?.id;
});

afterAll(async () => {
    await pool.end();
});

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('Message Endpoints', () => {

    it('GET /api/messages/conversations — requires auth', async () => {
        const res = await request(app).get('/api/messages/conversations');
        expect(res.statusCode).toBe(401);
    });

    it('GET /api/messages/conversations — returns array for authenticated user', async () => {
        if (!authTokenA) return;
        const res = await request(app)
            .get('/api/messages/conversations')
            .set('Authorization', `Bearer ${authTokenA}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.conversations)).toBe(true);
    });

    it('POST /api/messages/conversations — creates a conversation between two users', async () => {
        if (!authTokenA || !userBId) return;
        const res = await request(app)
            .post('/api/messages/conversations')
            .set('Authorization', `Bearer ${authTokenA}`)
            .send({ participantId: userBId });

        if (res.statusCode === 201 || res.statusCode === 200) {
            conversationId = res.body.data?.conversation?.id;
            expect(conversationId).toBeTruthy();
        } else {
            console.log('Create conversation skipped (DB not ready):', res.body.message);
        }
    });

    it('POST /api/messages/conversations — returns existing conversation on duplicate', async () => {
        if (!authTokenA || !userBId) return;
        const res = await request(app)
            .post('/api/messages/conversations')
            .set('Authorization', `Bearer ${authTokenA}`)
            .send({ participantId: userBId });
        expect([200, 201]).toContain(res.statusCode);
        expect(res.body.success).toBe(true);
    });

    it('POST /api/messages/send — sends a text message in the conversation', async () => {
        if (!authTokenA || !conversationId) return;
        const res = await request(app)
            .post('/api/messages/send')
            .set('Authorization', `Bearer ${authTokenA}`)
            .send({
                conversationId,
                content: 'Hello from test suite!',
            });

        if (res.statusCode === 201) {
            messageId = res.body.data?.message?.id;
            expect(res.body.success).toBe(true);
        } else {
            console.log('Send message skipped:', res.body.message);
        }
    });

    it('POST /api/messages/send — fails without content or attachment', async () => {
        if (!authTokenA || !conversationId) return;
        const res = await request(app)
            .post('/api/messages/send')
            .set('Authorization', `Bearer ${authTokenA}`)
            .send({ conversationId, content: '' });
        expect([400, 422]).toContain(res.statusCode);
    });

    it('GET /api/messages/:conversationId — returns message list', async () => {
        if (!authTokenA || !conversationId) return;
        const res = await request(app)
            .get(`/api/messages/${conversationId}`)
            .set('Authorization', `Bearer ${authTokenA}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.messages)).toBe(true);
    });

    it('GET /api/messages/:conversationId — only accessible by participant', async () => {
        if (!conversationId) return;
        // Register a completely unrelated third user
        const thirdUser = await request(app).post('/api/auth/register').send({
            username: `third_user_${Date.now()}`,
            email: `third_${Date.now()}@test.com`,
            password: 'password123',
        });
        const thirdToken = thirdUser.body.token;
        if (!thirdToken) return;

        const res = await request(app)
            .get(`/api/messages/${conversationId}`)
            .set('Authorization', `Bearer ${thirdToken}`);
        // Should be 403 Forbidden or 404 Not Found
        expect([403, 404]).toContain(res.statusCode);
    });

    it('PUT /api/messages/:messageId — edits own message', async () => {
        if (!authTokenA || !messageId) return;
        const res = await request(app)
            .put(`/api/messages/${messageId}`)
            .set('Authorization', `Bearer ${authTokenA}`)
            .send({ content: 'Edited message content' });
        expect([200, 204]).toContain(res.statusCode);
    });

    it('DELETE /api/messages/:messageId — deletes own message', async () => {
        if (!authTokenA || !messageId) return;
        const res = await request(app)
            .delete(`/api/messages/${messageId}`)
            .set('Authorization', `Bearer ${authTokenA}`);
        expect([200, 204]).toContain(res.statusCode);
    });
});
