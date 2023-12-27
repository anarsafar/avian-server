import Chance from 'chance';
import User from '../models/User.model';

const chance = new Chance();

export function generateRandumUserName(name: string): string {
    const passPhrase = chance.string({ casing: 'lower', symbols: false, length: 5, alpha: true });
    const cleanedName = name.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
    const userName = `${cleanedName}_${passPhrase}`;

    return userName;
}

export async function isPassphraseUnique(passphrase: string): Promise<boolean> {
    const existingUser = await User.findOne({ 'userInfo.username': passphrase });
    return !existingUser;
}
