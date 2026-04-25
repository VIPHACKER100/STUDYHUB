import request from 'supertest';
import app from '../index.js';
import { pool } from '../config/database.js';

describe('Auth Endpoints', () => {
    afterAll(async () => {
        // Clean up database or close connection if needed
        await pool.end();
    });

    const testUser = {
        username: 'test_user_' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        if (res.statusCode !== 201) {
            console.log('Register failed:', res.body);
        }
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
});

