import { NextFunction } from 'express';

import { config } from '../../../config/keys';
import User from '../../../models/User.model';
import { generateAccessToken, generateRefreshToken } from '../../../utils/generateTokens';
import { VerifyCallback } from 'passport-google-oauth20';
import generateRandumUserName from '../../../utils/generateRandomUserName';
import isPassphraseUnique from '../../../utils/isPassphraseUnique';

export enum SocialType {
    google = 'google',
    facebook = 'facebook',
    github = 'github'
}

export const strategyHelper = async (profile: any, done: VerifyCallback, provider: SocialType) => {
    try {
        const user = await User.findOne({ 'authInfo.providerId': profile.id });
        let randomUsername = generateRandumUserName(profile.displayName);

        while (!(await isPassphraseUnique(randomUsername))) {
            randomUsername = generateRandumUserName(profile.displayName);
        }

        if (!user) {
            const newUser = new User({
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
        } else {
            done(null, user);
        }
    } catch (error) {
        throw error;
    }
};

export const callbackHelper = async (user: any, err: Error, res: Response | any, next: NextFunction) => {
    if (!user) {
        return res.redirect(`${config.applicationURLs.frontendURL}/auth/signin?error=Social authentication failed`);
    }

    if (err) {
        next(err);
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', path: '/', domain: '.vercel.app' });

    res.redirect(`${config.applicationURLs.frontendURL}/auth/signin?accessToken=${accessToken}&id=${user.authInfo.providerId}`);
};
