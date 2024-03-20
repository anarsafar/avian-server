"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvatar = exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const storage_1 = require("firebase/storage");
const User_model_1 = __importDefault(require("../../models/User.model"));
const user_validate_1 = require("./user.validate");
const isPassphraseUnique_1 = __importDefault(require("../../utils/isPassphraseUnique"));
const socket_1 = require("../../socket");
const getUser = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const user = await User_model_1.default.findById(userId)
            .select('-authInfo.confirmationCode')
            .select('-authInfo.confirmed')
            .select('-authInfo.password')
            .select('-authInfo.confirmationTimestamp')
            .select('-resetPassword');
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ error: 'user not found' });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { file, body } = req;
        const { theme, username, ...updateData } = body;
        let updatedUserInfo = {};
        if (username && !(await (0, isPassphraseUnique_1.default)(username, userId))) {
            return res.status(409).json({ error: 'username already taken' });
        }
        if (body && file) {
            user_validate_1.UpdateUserValidate.parse({ ...body, avatar: file });
        }
        else {
            user_validate_1.UpdateUserValidate.parse({ ...body });
        }
        if (file) {
            const storage = (0, storage_1.getStorage)();
            const storageRef = (0, storage_1.ref)(storage, 'avatars/' + file.originalname);
            await (0, storage_1.uploadBytes)(storageRef, file.buffer);
            const downloadURL = await (0, storage_1.getDownloadURL)(storageRef);
            updatedUserInfo = { ...updateData, avatar: downloadURL, username };
        }
        else if (username) {
            updatedUserInfo = { ...updateData, username };
        }
        else {
            updatedUserInfo = { ...updateData };
        }
        const existingUser = await User_model_1.default.findById(userId)
            .select('-authInfo.confirmationCode')
            .select('-authInfo.confirmed')
            .select('-authInfo.password')
            .select('-authInfo.confirmationTimestamp')
            .select('-resetPassword');
        if (existingUser) {
            if (theme !== undefined) {
                existingUser.preferences.theme = theme;
                existingUser.markModified('preferences');
            }
            existingUser.userInfo = { ...existingUser?.userInfo, ...updatedUserInfo };
            existingUser.markModified('userInfo');
            await existingUser.save();
            const io = (0, socket_1.getIO)();
            io.emit('refreshData', existingUser._id);
            res.status(200).json({ user: existingUser });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const user = await User_model_1.default.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json({ message: 'Account Deleted Successfully' });
        }
        else {
            res.status(404).json({ error: 'user not found' });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
const deleteAvatar = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const user = await User_model_1.default.findById(userId);
        if (user) {
            user.userInfo.avatar = '';
            user.markModified('userInfo');
            await user.save();
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ error: 'user not found' });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.deleteAvatar = deleteAvatar;
//# sourceMappingURL=user.handler.js.map