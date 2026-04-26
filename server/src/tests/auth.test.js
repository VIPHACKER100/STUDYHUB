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
        password: 'password123',
        role: 'student'
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        if (res.statusCode !== 201) {
            console.log('Register failed:', res.body);
        }
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user).toHaveProperty('email', testUser.email);
    });

    it('should login the user with email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: testUser.email,
                password: testUser.password
            });
 
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('token');
    });

    it('should login the user with username', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: testUser.username,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
});

