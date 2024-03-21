"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const social_helper_1 = require("./social.helper");
const socialRoute = express_1.default.Router();
socialRoute.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
socialRoute.get('/google/callback', (req, res, next) => {
    passport_1.default.authenticate('google', async (err, user) => {
        (0, social_helper_1.callbackHelper)(user, err, res, next);
    })(req, res);
});
socialRoute.get('/facebook', passport_1.default.authenticate('facebook'));
socialRoute.get('/facebook/callback', (req, res, next) => {
    passport_1.default.authenticate('facebook', async (err, user) => {
        (0, social_helper_1.callbackHelper)(user, err, res, next);
    })(req, res);
});
socialRoute.get('/github', passport_1.default.authenticate('github', { session: false, scope: ['user:email'] }));
socialRoute.get('/github/callback', (req, res, next) => {
    passport_1.default.authenticate('github', async (err, user) => {
        (0, social_helper_1.callbackHelper)(user, err, res, next);
    })(req, res);
});
exports.default = socialRoute;
