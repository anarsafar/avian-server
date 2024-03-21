"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../config/keys");
const authenticateToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (accessToken && refreshToken) {
            const decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, keys_1.config.jwtTokens.accessSecretKey);
            const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, keys_1.config.jwtTokens.refreshSecretKey);
            if (decodedAccessToken.userId !== decodedRefreshToken.userId) {
                return res.status(401).json({ error: 'User IDs in tokens do not match' });
            }
            req.user = {
                userId: decodedAccessToken.userId
            };
            next();
        }
        else {
            throw new Error('Missing token');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.default = authenticateToken;
