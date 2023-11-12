import { NextFunction } from 'express';

import { config } from '../../../config/keys';
import User from '../../../models/User.model';
import { generateAccessToken, generateRefreshToken } from '../../../utils/generateTokens';
import { VerifyCallback } from 'passport-google-oauth20';

export enum SocialType {
    google = 'google',
    facebook = 'facebook',
    github = 'github'
}

export const strategyHelper = async (profile: any, done: VerifyCallback, provider: SocialType) => {
    try {
        console.log(profile);
        const user = await User.findOne({ 'authInfo.providerId': profile.id });

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
                    avatar: profile.photos[0].value
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
        return res.status(401).json({ error: 'Social authentication failed' });
    }

    if (err) {
        next(err);
    }

    const accessToken = await generateAccessToken(user.authInfo.providerId);
    const refreshToken = await generateRefreshToken(user.authInfo.providerId);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: config.nodeEnv === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', path: '/' }); // 7 days
    res.redirect(`${config.applicationURLs.frontendURL}/auth/login?accessToken=${accessToken}`);
};
