import { NextFunction, RequestHandler, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/keys';
import { JwtInterface } from '../interfaces/JwtInterface';

const authenticateToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (accessToken && refreshToken) {
            const decodedAccessToken = jwt.verify(accessToken, config.jwtTokens.accessSecretKey) as JwtInterface;
            const decodedRefreshToken = jwt.verify(refreshToken, config.jwtTokens.refreshSecretKey) as JwtInterface;

            if (decodedAccessToken.userId !== decodedRefreshToken.userId) {
                return res.status(401).json({ error: 'User IDs in tokens do not match' });
            }

            req.user = {
                userId: decodedAccessToken.userId
            };

            next();
        } else {
            throw new Error('Missing token');
        }
    } catch (error) {
        next(error);
    }
};

export default authenticateToken;
