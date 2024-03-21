"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../models/User.model"));
const resetPasswordService = async (password, confirmPassword, email) => {
    let result = {};
    const existingUser = await User_model_1.default.findOne({ 'authInfo.email': email });
    if (!existingUser?.resetPassword?.confirmed) {
        result.error = 'Please confirm your email';
        return result;
    }
    if (existingUser) {
        const isPasswordSame = await bcrypt_1.default.compare(password, existingUser.authInfo.password);
        if (isPasswordSame) {
            result.error = 'Your new password must be different from old password';
        }
        else {
            existingUser.authInfo.password = await bcrypt_1.default.hash(password, 10);
            existingUser.resetPassword.confirmed = false;
            existingUser.resetPassword.confirmationCode = '';
            existingUser.markModified(`authInfo`);
            existingUser.markModified(`resetPassword`);
            await existingUser.save();
            result.message = 'Password changed successfully';
        }
    }
    else {
        result.error = 'User does not exist';
    }
    return result;
};
exports.default = resetPasswordService;
