import mongoose from 'mongoose';
import User from '../models/User.model';

async function isPassphraseUnique(passphrase: string, userId?: string): Promise<boolean> {
    const existingUser = await User.findOne({ 'userInfo.username': passphrase });
    if (existingUser && userId) {
        const mongoId = new mongoose.Types.ObjectId(userId);
        return String(mongoId) === String(existingUser._id);
    }
    return !existingUser;
}

export default isPassphraseUnique;
