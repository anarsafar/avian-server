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
exports.delivered = exports.logOut = exports.logIn = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../../../models/User.model"));
const generateConfirmation_1 = __importDefault(require("../../../utils/generateConfirmation"));
const sendEmail_service_1 = __importStar(require("../../../services/sendEmail.service"));
const keys_1 = require("../../../config/keys");
const generateTokens_1 = require("../../../utils/generateTokens");
const blacklist_service_1 = __importStar(require("../../../services/blacklist.service"));
const generateRandomUserName_1 = __importDefault(require("../../../utils/generateRandomUserName"));
const isPassphraseUnique_1 = __importDefault(require("../../../utils/isPassphraseUnique"));
const socket_1 = require("../../../socket");
const signUp = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        let existingUser = await User_model_1.default.findOne({ 'authInfo.email': email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const confirmationCode = (0, generateConfirmation_1.default)(6);
        let randomUsername = (0, generateRandomUserName_1.default)(name);
        while (!(await (0, isPassphraseUnique_1.default)(randomUsername))) {
            randomUsername = (0, generateRandomUserName_1.default)(name);
        }
        const newUser = new User_model_1.default({
            authType: 'local',
            authInfo: {
                email,
                password: hashedPassword,
                confirmationCode,
                confirmed: false,
                confirmationTimestamp: new Date()
            },
            userInfo: {
                name,
                username: randomUsername
            }
        });
        await newUser.save();
        await (0, sendEmail_service_1.default)(email, confirmationCode, sendEmail_service_1.EmailType.signup);
        res.status(201).json({ message: 'Check email inbox for confirmation' });
    }
    catch (error) {
        next(error);
    }
};
exports.signUp = signUp;
const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let existingUser = await User_model_1.default.findOne({ 'authInfo.email': email });
        if (!existingUser) {
            return res.status(401).json({ error: 'User does not exist' });
        }
        if (!existingUser.authInfo.confirmed) {
            return res.status(401).json({ error: 'Please confirm your email.' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, existingUser.authInfo.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password credential' });
        }
        const accessToken = await (0, generateTokens_1.generateAccessToken)(existingUser._id);
        const refreshToken = await (0, generateTokens_1.generateRefreshToken)(existingUser._id);
        res.setHeader('Set-Cookie', [`refreshToken=${refreshToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60 * 1000}; SameSite=None; Path=/; Partitioned`]);
        res.status(200).json({ accessToken });
    }
    catch (error) {
        next(error);
    }
};
exports.logIn = logIn;
const logOut = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        const { refreshToken } = req.cookies;
        let decodedAccessToken;
        let decodedRefreshToken;
        try {
            decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, keys_1.config.jwtTokens.accessSecretKey);
            await (0, blacklist_service_1.default)(accessToken, decodedAccessToken.exp, blacklist_service_1.TokenType.Access);
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid or expired access token' });
        }
        try {
            decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, keys_1.config.jwtTokens.refreshSecretKey);
            await (0, blacklist_service_1.default)(refreshToken, decodedRefreshToken.exp, blacklist_service_1.TokenType.Refresh);
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }
        try {
            res.setHeader('Set-Cookie', [`refreshToken=; HttpOnly; Secure; Max-Age=0; SameSite=None; Path=/; Partitioned`]);
        }
        catch (error) {
            return res.status(500).json({ error: 'Error clearing refresh token cookie' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logOut = logOut;
const delivered = async (req, res, next) => {
    try {
        const [deliveredData] = req.body;
        const { email } = deliveredData;
        const io = (0, socket_1.getIO)();
        console.log(email);
        let existingUser = await User_model_1.default.findOne({ 'authInfo.email': email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User does not exist' });
        }
        existingUser.authInfo.confirmationTimestamp = new Date();
        existingUser.markModified('authInfo');
        existingUser.save();
        io.emit('confirmation-sent', email);
        return res.status(200).json({ message: 'Email Delivered' });
    }
    catch (error) {
        next(error);
    }
};
exports.delivered = delivered;
