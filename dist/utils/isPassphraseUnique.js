"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../models/User.model"));
async function isPassphraseUnique(passphrase, userId) {
    const existingUser = await User_model_1.default.findOne({ 'userInfo.username': passphrase });
    if (existingUser && userId) {
        const mongoId = new mongoose_1.default.Types.ObjectId(userId);
        return String(mongoId) === String(existingUser._id);
    }
    return !existingUser;
}
exports.default = isPassphraseUnique;
