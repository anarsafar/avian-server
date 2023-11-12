import { startSession } from 'mongoose';
import BlacklistToken, { BlackListInterface } from '../models/Blacklist.model';

export enum TokenType {
    Access = 'access',
    Refresh = 'refresh'
}

const addToBlacklist = async (token: string, decodedTokenExp: number, type: TokenType) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const existingToken = await BlacklistToken.findOne({ token });

        if (existingToken) {
            console.log('Token already exists in the blacklist');
            return;
        }

        const expiration = new Date(decodedTokenExp * 1000);

        if (type === TokenType.Access) {
            expiration.setHours(expiration.getHours() + 5);
        } else if (type === TokenType.Refresh) {
            expiration.setDate(expiration.getDate() + 7);
        }

        const newBlacklistToken = new BlacklistToken<BlackListInterface>({
            token,
            expiration,
            type
        });

        await newBlacklistToken.save({ session });
        await session.commitTransaction();
    } catch (error) {
        throw error;
    } finally {
        session.endSession();
    }
};

export default addToBlacklist;
