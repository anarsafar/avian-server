import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { config } from '../../config/keys';
import { JwtInterface } from '../../interfaces/JwtInterface';

const verifyJwt = (accessToken: string, secretKey: string): JwtInterface | null => {
    try {
        return jwt.verify(accessToken, secretKey) as JwtInterface;
    } catch (error) {
        throw new Error('Invalid access token');
    }
};

const verifyAccess = (header: string | undefined, socket: Socket): boolean => {
    try {
        if (header) {
            const [bearer, token] = header.split(' ');

            if (bearer.toLowerCase() === 'bearer' && token) {
                const decodedAccessToken = verifyJwt(token, config.jwtTokens.accessSecretKey) as JwtInterface;
                socket.data.userId = decodedAccessToken.userId;

                return !!decodedAccessToken;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
};

export default verifyAccess;
