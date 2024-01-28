import jwt from 'jsonwebtoken';

import { config } from '../../config/keys';
import { JwtInterface } from '../../interfaces/JwtInterface';
import { Socket } from 'socket.io';

const verifyAccess = (header: string | undefined, socket: Socket): boolean => {
    try {
        if (header) {
            const accessToken = header.split(' ')[1];
            const decodedAccessToken = jwt.verify(accessToken, config.jwtTokens.accessSecretKey) as JwtInterface;
            const customSocket = socket as Socket & { userId: string };
            customSocket.userId = decodedAccessToken.userId;
            return !!decodedAccessToken;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export default verifyAccess;
