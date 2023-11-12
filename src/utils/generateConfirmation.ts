import crypto from 'crypto';

function generateConfirmation(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomBytes.readUInt8(i) % characters.length;
        result += characters.charAt(randomIndex);
    }

    return result;
}

export default generateConfirmation;
