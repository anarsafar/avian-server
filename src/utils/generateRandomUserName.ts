import Chance from 'chance';

const chance = new Chance();

function generateRandumUserName(name: string): string {
    const passPhrase = chance.string({ casing: 'lower', symbols: false, length: 5, alpha: true });
    const cleanedName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const userName = `${cleanedName}_${passPhrase}`;

    return userName;
}

export default generateRandumUserName;
