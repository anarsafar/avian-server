"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Blacklist_model_1 = __importDefault(require("../models/Blacklist.model"));
const blacklisted = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const { refreshToken } = req.cookies;
        if (!authorization) {
            return res.status(401).json({ error: 'Access token is missing' });
        }
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token is missing' });
        }
        const accessToken = authorization.split(' ')[1];
        const blacklistedAccessToken = await Blacklist_model_1.default.findOne({ token: accessToken });
        if (blacklistedAccessToken) {
            return res.status(401).json({ error: 'Access token is blacklisted' });
        }
        const blacklistedRefreshToken = await Blacklist_model_1.default.findOne({ token: refreshToken });
        if (blacklistedRefreshToken) {
            return res.status(401).json({ error: 'Refresh token is blacklisted' });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = blacklisted;
