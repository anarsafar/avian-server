import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../../models/User.model';
import generateConfirmation from '../../../utils/generateConfirmation';
import sendEmail, { EmailType } from '../../../services/sendEmail.service';
import { config } from '../../../config/keys';
import { generateAccessToken, generateRefreshToken } from '../../../utils/generateTokens';
import { LoginValidate, SignupValidate } from './local.validate';
import addToBlacklist, { TokenType } from '../../../services/blacklist.service';
import MessageResponse from '../../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../../interfaces/ErrorResponses';
import { JwtInterface } from '../../../interfaces/JwtInterface';
import generateRandumUserName from '../../../utils/generateRandomUserName';
import isPassphraseUnique from '../../../utils/isPassphraseUnique';

export const signUp = async (req: Request<{}, MessageResponse | GeneralErrorResponse, SignupValidate>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;

        let existingUser = await User.findOne({ 'authInfo.email': email });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmationCode = generateConfirmation(6);
        let randomUsername = generateRandumUserName(name);

        while (!(await isPassphraseUnique(randomUsername))) {
            randomUsername = generateRandumUserName(name);
        }

        const newUser = new User({
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
        await sendEmail(email, confirmationCode, EmailType.signup);

        res.status(201).json({ message: 'Check email inbox for confirmation' });
    } catch (error) {
        next(error);
    }
};

export const logIn = async (req: Request<{}, { accessToken: string } | GeneralErrorResponse, LoginValidate>, res: Response<{ accessToken: string } | GeneralErrorResponse>, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        let existingUser = await User.findOne({ 'authInfo.email': email });

        if (!existingUser) {
            return res.status(401).json({ error: 'User does not exist' });
        }

        if (!existingUser.authInfo.confirmed) {
            return res.status(401).json({ error: 'Please confirm your email.' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.authInfo.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password credential' });
        }

        const accessToken = await generateAccessToken(existingUser._id);
        const refreshToken = await generateRefreshToken(existingUser._id);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: config.nodeEnv === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', path: '/' });
        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

export const logOut = async (req: Request, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1] as string;
        const { refreshToken } = req.cookies;

        let decodedAccessToken;
        let decodedRefreshToken;

        try {
            decodedAccessToken = jwt.verify(accessToken, config.jwtTokens.accessSecretKey) as JwtInterface;
            await addToBlacklist(accessToken, decodedAccessToken.exp, TokenType.Access);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired access token' });
        }

        try {
            decodedRefreshToken = jwt.verify(refreshToken, config.jwtTokens.refreshSecretKey) as JwtInterface;
            await addToBlacklist(refreshToken, decodedRefreshToken.exp, TokenType.Refresh);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        try {
            res.clearCookie('refreshToken', {
                path: '/',
                expires: new Date(0),
                sameSite: 'none',
                secure: true
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error clearing refresh token cookie' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};
