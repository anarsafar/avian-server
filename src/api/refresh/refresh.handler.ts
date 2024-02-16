import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import BlacklistToken from '../../models/Blacklist.model';
import { config } from '../../config/keys';
import User from '../../models/User.model';
import addToBlacklist, { TokenType } from '../../services/blacklist.service';
import { generateAccessToken } from '../../utils/generateTokens';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import { JwtInterface } from '../../interfaces/JwtInterface';

const refreshTokenHandler = async (req: Request, res: Response<GeneralErrorResponse | { accessToken: string }>, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;
        let decodedRefreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token is missing' });
        }

        const blacklistedRefreshToken = await BlacklistToken.findOne({ token: refreshToken });

        if (blacklistedRefreshToken) {
            return res.status(401).json({ error: 'Refresh token is blacklisted' });
        }

        try {
            decodedRefreshToken = jwt.verify(refreshToken, config.jwtTokens.refreshSecretKey, { algorithms: ['HS256'] }) as JwtInterface;

            const user = await User.findById(decodedRefreshToken.userId);

            if (!user) {
                return res.status(404).json({ error: 'Invalid refresh token' });
            }

            const accessToken = req.headers.authorization?.split(' ')[1];

            if (accessToken != 'null' && accessToken) {
                const blacklistedAccessToken = await BlacklistToken.findOne({ token: accessToken });

                if (!blacklistedAccessToken) {
                    await addToBlacklist(accessToken, Math.floor(Date.now() / 1000), TokenType.Access);
                }
            }

            const newAccessToken = await generateAccessToken(user._id);

            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    } catch (error) {
        next(error);
    }
};

export default refreshTokenHandler;
