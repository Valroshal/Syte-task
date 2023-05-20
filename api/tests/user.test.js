const { describe, it, expect, beforeAll} = require('@jest/globals');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateToken, login } = require('../services/userController');
const User = require('../model/user')

describe('validateToken', () => {
    beforeAll(() => {
        // Mock dependencies
        const {jest} = require('@jest/globals')
        jest.mock('bcrypt');
        jest.mock('jsonwebtoken');

    });
    it('should return a 401 status if no token is provided', () => {
        const {jest} = require('@jest/globals')
        const req = { headers: {}, query: {}, cookies: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        validateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return a 401 status if an invalid token is provided', () => {
        const {jest} = require('@jest/globals')
        const req = { headers: { authorization: 'Bearer invalid-token' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation((token, key, callback) => {
            callback(new Error('Invalid token'));
        });

        validateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should set userId in the request object if a valid token is provided', () => {
        const {jest} = require('@jest/globals')
        const req = { headers: { authorization: 'Bearer valid-token' } };
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation((token, key, callback) => {
            callback(null, { user_id: '123' });
        });

        validateToken(req, res, next);

        expect(req.userId).toBe('123');
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});


describe('login', () => {
    beforeAll(() => {
        // Mock dependencies
        const {jest} = require('@jest/globals')
        jest.mock('bcrypt');
        jest.mock('jsonwebtoken');

    });
    it('should return a 400 status if email and password are not provided', async () => {
        const {jest} = require('@jest/globals')
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('All inputs are required');
    });

    it('should return a 200 status with user data if credentials are valid', async () => {
        const {jest} = require('@jest/globals')

        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const user = {
            _id: '123',
            email: 'test@example.com',
            _doc: { password: 'hashed-password' }
        };

        jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
        jest.spyOn(jwt, 'sign').mockReturnValueOnce('valid-token');

        await login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed-password');
        expect(jwt.sign).toHaveBeenCalledWith(
            { user_id: '123', email: 'test@example.com' },
            process.env.TOKEN_KEY,
            { expiresIn: '2h' }
        );
        expect(user.token).toBe('valid-token');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return a 400 status if credentials are invalid', async () => {
        const {jest} = require('@jest/globals')

        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

        await login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed-password');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid Credentials');
    });

    it('should return a 500 status if an error occurs', async () => {
        const {jest} = require('@jest/globals')

        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Database error'));

        await login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
