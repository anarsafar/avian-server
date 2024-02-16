import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';

import { config } from '../../../config/keys';
import { SocialType, strategyHelper } from './social.helper';

const googleStrategy = new GoogleStrategy(
    {
        clientID: config.google.clientId,
        clientSecret: config.google.secretKey,
        callbackURL: `${config.applicationURLs.serverURL}/api/v1/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        strategyHelper(profile, done, SocialType.google);
    }
);

const facebookStrategy = new FacebookStrategy(
    {
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.secretKey,
        callbackURL: `${config.applicationURLs.serverURL}/api/v1/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'name', 'gender', 'photos']
    },
    function (accessToken, refreshToken, profile, cb) {
        strategyHelper(profile, cb, SocialType.facebook);
    }
);

const githubStrategy = new GitHubStrategy(
    {
        clientID: config.github.clientId,
        clientSecret: config.github.secretKey,
        callbackURL: `${config.applicationURLs.serverURL}/api/v1/auth/github/callback`
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
        strategyHelper(profile, done, SocialType.github);
    }
);

const strategies = { googleStrategy, facebookStrategy, githubStrategy };

export default strategies;
