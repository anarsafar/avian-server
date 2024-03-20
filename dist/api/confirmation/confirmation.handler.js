"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiration = exports.sendVerification = exports.confirmUser = void 0;
const User_model_1 = __importDefault(require("../../models/User.model"));
const generateConfirmation_1 = __importDefault(require("../../utils/generateConfirmation"));
const sendEmail_service_1 = __importStar(require("../../services/sendEmail.service"));
const confirmUser = async (req, res, next) => {
    const { confirmationCode, confirmationType, email } = req.body;
    const searchQuery = confirmationType === 'password' ? 'resetPassword' : 'authInfo';
    try {
        const existingUser = await User_model_1.default.findOne({ 'authInfo.email': email });
        if (existingUser) {
            const confirmed = existingUser[searchQuery].confirmed;
            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed` });
            }
            else {
                if (confirmationCode !== existingUser[searchQuery].confirmationCode) {
                    return res.status(400).json({ error: 'Please provide correct confirmation code' });
                }
                else {
                    const confirmationTimestamp = existingUser[searchQuery].confirmationTimestamp;
                    const currentTime = new Date();
                    const timeDifference = currentTime.getTime() - confirmationTimestamp.getTime();
                    if (timeDifference > 5 * 60 * 1000) {
                        return res.status(422).json({ error: 'Confirmation code has expired' });
                    }
                    else {
                        existingUser[searchQuery].confirmed = true;
                        existingUser.markModified(`${searchQuery}.confirmed`);
                        await existingUser.save();
                        return res.status(200).json({ message: `Email confirmed successfully` });
                    }
                }
            }
        }
        else {
            res.status(422).json({ error: 'User does not exist' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.confirmUser = confirmUser;
const sendVerification = async (req, res, next) => {
    const { email, confirmationType } = req.body;
    const searchQuery = confirmationType === 'password' ? 'resetPassword' : 'authInfo';
    try {
        let existingUser = await User_model_1.default.findOne({ 'authInfo.email': email });
        if (existingUser) {
            const confirmed = existingUser[searchQuery]?.confirmed;
            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed.` });
            }
            else {
                existingUser[searchQuery].confirmationCode = (0, generateConfirmation_1.default)(6);
                existingUser[searchQuery].confirmationTimestamp = new Date();
                existingUser.markModified(searchQuery);
                await existingUser.save();
                await (0, sendEmail_service_1.default)(email, existingUser[searchQuery].confirmationCode, confirmationType === 'email' ? sendEmail_service_1.EmailType.signup : sendEmail_service_1.EmailType.reset);
                return res.status(200).json({ message: 'Check email inbox for new confirmation' });
            }
        }
        else {
            res.status(422).json({ error: 'User does not exist' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.sendVerification = sendVerification;
const getExpiration = async (req, res, next) => {
    const { email, confirmationType } = req.body;
    const searchQuery = confirmationType === 'password' ? 'resetPassword' : 'authInfo';
    try {
        let existingUser = await User_model_1.default.findOne({ 'authInfo.email': email });
        if (existingUser) {
            const confirmed = existingUser[searchQuery].confirmed;
            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed.` });
            }
            else {
                return res.status(200).json({ confirmationTimestamp: existingUser[searchQuery].confirmationTimestamp });
            }
        }
        else {
            res.status(422).json({ error: 'User does not exists' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getExpiration = getExpiration;
//# sourceMappingURL=confirmation.handler.js.map