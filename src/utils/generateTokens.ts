import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { config } from '../config/keys';

export const generateAccessToken = (id: ObjectId): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign({ userId: id }, config.jwtTokens.accessSecretKey, { algorithm: 'HS256', expiresIn: '5h' }, (err, token) => {
            if (err) {
                reject(err);
            } else if (token) {
                resolve(token);
            }
        });
    });
};

export const generateRefreshToken = (id: ObjectId): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign({ userId: id }, config.jwtTokens.refreshSecretKey, { algorithm: 'HS256', expiresIn: '7d' }, (err, token) => {
            if (err) {
                reject(err);
            } else if (token) {
                resolve(token);
            }
        });
    });
};
