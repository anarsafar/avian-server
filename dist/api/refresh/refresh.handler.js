"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Blacklist_model_1 = __importDefault(require("../../models/Blacklist.model"));
const keys_1 = require("../../config/keys");
const User_model_1 = __importDefault(require("../../models/User.model"));
const blacklist_service_1 = __importStar(require("../../services/blacklist.service"));
const generateTokens_1 = require("../../utils/generateTokens");
const refreshTokenHandler = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        let decodedRefreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token is missing' });
        }
        const blacklistedRefreshToken = await Blacklist_model_1.default.findOne({ token: refreshToken });
        if (blacklistedRefreshToken) {
            return res.status(401).json({ error: 'Refresh token is blacklisted' });
        }
        try {
            decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, keys_1.config.jwtTokens.refreshSecretKey, { algorithms: ['HS256'] });
            const user = await User_model_1.default.findById(decodedRefreshToken.userId);
            if (!user) {
                return res.status(404).json({ error: 'Invalid refresh token' });
            }
            const accessToken = req.headers.authorization?.split(' ')[1];
            if (accessToken != 'null' && accessToken) {
                const blacklistedAccessToken = await Blacklist_model_1.default.findOne({ token: accessToken });
                if (!blacklistedAccessToken) {
                    await (0, blacklist_service_1.default)(accessToken, Math.floor(Date.now() / 1000), blacklist_service_1.TokenType.Access);
                }
            }
            const newAccessToken = await (0, generateTokens_1.generateAccessToken)(user._id);
            return res.status(200).json({ accessToken: newAccessToken });
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.default = refreshTokenHandler;
//# sourceMappingURL=refresh.handler.js.map