"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../../config/keys");
const verifyJwt = (accessToken, secretKey) => {
    try {
        return jsonwebtoken_1.default.verify(accessToken, secretKey);
    }
    catch (error) {
        throw new Error('Invalid access token');
    }
};
const verifyAccess = (header, socket) => {
    try {
        if (header) {
            const [bearer, token] = header.split(' ');
            if (bearer.toLowerCase() === 'bearer' && token) {
                const decodedAccessToken = verifyJwt(token, keys_1.config.jwtTokens.accessSecretKey);
                socket.data.userId = decodedAccessToken.userId;
                return !!decodedAccessToken;
            }
        }
        return false;
    }
    catch (error) {
        return false;
    }
};
exports.default = verifyAccess;
