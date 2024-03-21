"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackHelper = exports.strategyHelper = exports.SocialType = void 0;
const keys_1 = require("../../../config/keys");
const User_model_1 = __importDefault(require("../../../models/User.model"));
const generateTokens_1 = require("../../../utils/generateTokens");
const generateRandomUserName_1 = __importDefault(require("../../../utils/generateRandomUserName"));
const isPassphraseUnique_1 = __importDefault(require("../../../utils/isPassphraseUnique"));
var SocialType;
(function (SocialType) {
    SocialType["google"] = "google";
    SocialType["facebook"] = "facebook";
    SocialType["github"] = "github";
})(SocialType || (exports.SocialType = SocialType = {}));
const strategyHelper = async (profile, done, provider) => {
    try {
        const user = await User_model_1.default.findOne({ 'authInfo.providerId': profile.id });
        let randomUsername = (0, generateRandomUserName_1.default)(profile.displayName);
        while (!(await (0, isPassphraseUnique_1.default)(randomUsername))) {
            randomUsername = (0, generateRandomUserName_1.default)(profile.displayName);
        }
        if (!user) {
            const newUser = new User_model_1.default({
                authType: 'social',
                authInfo: {
                    provider,
                    providerId: profile.id
                },
                userInfo: {
                    name: profile.displayName,
                    bio: provider === 'github' ? profile._json.bio : '',
                    avatar: profile.photos[0].value,
                    username: randomUsername
                }
            });
            await newUser.save();
            done(null, newUser);
        }
        else {
            done(null, user);
        }
    }
    catch (error) {
        throw error;
    }
};
exports.strategyHelper = strategyHelper;
const callbackHelper = async (user, err, res, next) => {
    if (!user) {
        return res.redirect(`${keys_1.config.applicationURLs.frontendURL}/auth/signin?error=Social authentication failed`);
    }
    if (err) {
        next(err);
    }
    const accessToken = await (0, generateTokens_1.generateAccessToken)(user._id);
    const refreshToken = await (0, generateTokens_1.generateRefreshToken)(user._id);
    // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', path: '/' }); // 7 days
    res.setHeader('Set-Cookie', [`refreshToken=${refreshToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60 * 1000}; SameSite=None; Path=/; Partitioned`]);
    res.redirect(`${keys_1.config.applicationURLs.frontendURL}/auth/signin?accessToken=${accessToken}&id=${user.authInfo.providerId}`);
};
exports.callbackHelper = callbackHelper;
