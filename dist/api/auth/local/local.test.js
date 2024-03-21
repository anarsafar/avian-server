"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
describe('Testing the signUp route', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect('mongodb://127.0.0.1/testing');
    });
    afterAll(async () => {
        await mongoose_1.default.connection.close();
    });
    it('should create a new user', async () => {
        const newUser = {
            email: 'test@example.com',
            password: 'Password123!',
            name: 'Test User'
        };
        const response = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/signup').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Check email inbox for confirmation');
    });
    it('should send new confirmation for an unconfirmed user', async () => {
        const unconfirmedUser = {
            email: 'test@example.com',
            password: 'Password123!'
        };
        const response = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/signup').send(unconfirmedUser);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Check email inbox for new confirmation');
    });
    it('should return a 409 status for an existing email', async () => {
        const existingUser = {
            email: 'test@example.com',
            password: 'Password123!'
        };
        const response = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/signup').send(existingUser);
        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Email already exists');
    });
});
