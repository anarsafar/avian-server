"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../config/keys");
const generateAccessToken = (id) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ userId: id }, keys_1.config.jwtTokens.accessSecretKey, { algorithm: 'HS256', expiresIn: '5h' }, (err, token) => {
            if (err) {
                reject(err);
            }
            else if (token) {
                resolve(token);
            }
        });
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ userId: id }, keys_1.config.jwtTokens.refreshSecretKey, { algorithm: 'HS256', expiresIn: '7d' }, (err, token) => {
            if (err) {
                reject(err);
            }
            else if (token) {
                resolve(token);
            }
        });
    });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=generateTokens.js.map