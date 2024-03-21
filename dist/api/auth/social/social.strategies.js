"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_github2_1 = require("passport-github2");
const keys_1 = require("../../../config/keys");
const social_helper_1 = require("./social.helper");
const googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: keys_1.config.google.clientId,
    clientSecret: keys_1.config.google.secretKey,
    callbackURL: `${keys_1.config.applicationURLs.serverURL}/api/v1/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    (0, social_helper_1.strategyHelper)(profile, done, social_helper_1.SocialType.google);
});
const facebookStrategy = new passport_facebook_1.Strategy({
    clientID: keys_1.config.facebook.clientId,
    clientSecret: keys_1.config.facebook.secretKey,
    callbackURL: `${keys_1.config.applicationURLs.serverURL}/api/v1/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'gender', 'photos']
}, function (accessToken, refreshToken, profile, cb) {
    (0, social_helper_1.strategyHelper)(profile, cb, social_helper_1.SocialType.facebook);
});
const githubStrategy = new passport_github2_1.Strategy({
    clientID: keys_1.config.github.clientId,
    clientSecret: keys_1.config.github.secretKey,
    callbackURL: `${keys_1.config.applicationURLs.serverURL}/api/v1/auth/github/callback`
}, (accessToken, refreshToken, profile, done) => {
    (0, social_helper_1.strategyHelper)(profile, done, social_helper_1.SocialType.github);
});
const strategies = { googleStrategy, facebookStrategy, githubStrategy };
exports.default = strategies;
