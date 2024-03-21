"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../../models/User.model"));
const updateUserStatus = async (userId, status) => {
    let existingUser = await User_model_1.default.findById(userId).exec();
    if (!existingUser) {
        throw new Error('User not found');
    }
    existingUser.online = status === 'online';
    if (status === 'offline') {
        existingUser.lastSeen = new Date();
    }
    await existingUser.save();
};
exports.default = updateUserStatus;
