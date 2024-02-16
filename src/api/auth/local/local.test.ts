import request from 'supertest';
import app from '../../../app';
import mongoose from 'mongoose';

describe('Testing the signUp route', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1/testing');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        const newUser = {
            email: 'test@example.com',
            password: 'Password123!',
            name: 'Test User'
        };

        const response = await request(app).post('/api/v1/auth/signup').send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Check email inbox for confirmation');
    });

    it('should send new confirmation for an unconfirmed user', async () => {
        const unconfirmedUser = {
            email: 'test@example.com',
            password: 'Password123!'
        };

        const response = await request(app).post('/api/v1/auth/signup').send(unconfirmedUser);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Check email inbox for new confirmation');
    });

    it('should return a 409 status for an existing email', async () => {
        const existingUser = {
            email: 'test@example.com',
            password: 'Password123!'
        };

        const response = await request(app).post('/api/v1/auth/signup').send(existingUser);

        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Email already exists');
    });
});
