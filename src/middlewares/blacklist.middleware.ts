import { Request, Response, NextFunction, RequestHandler } from 'express';

import BlacklistToken from '../models/Blacklist.model';
import { GeneralErrorResponse } from '../interfaces/ErrorResponses';

const blacklisted: RequestHandler = async (req: Request, res: Response<GeneralErrorResponse>, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        const { refreshToken } = req.cookies;

        if (!authorization) {
            return res.status(401).json({ error: 'Access token is missing' });
        }

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token is missing' });
        }

        const accessToken = authorization.split(' ')[1];

        const blacklistedAccessToken = await BlacklistToken.findOne({ token: accessToken });
        if (blacklistedAccessToken) {
            return res.status(401).json({ error: 'Access token is blacklisted' });
        }

        const blacklistedRefreshToken = await BlacklistToken.findOne({ token: refreshToken });
        if (blacklistedRefreshToken) {
            return res.status(401).json({ error: 'Refresh token is blacklisted' });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default blacklisted;
