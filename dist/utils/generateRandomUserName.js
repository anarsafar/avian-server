"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chance_1 = __importDefault(require("chance"));
const chance = new chance_1.default();
function generateRandumUserName(name) {
    const passPhrase = chance.string({ casing: 'lower', symbols: false, length: 5, alpha: true });
    const cleanedName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const userName = `${cleanedName}_${passPhrase}`;
    return userName;
}
exports.default = generateRandumUserName;
