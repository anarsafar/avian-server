"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.getConversations = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const getConversations = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = await User_model_1.default.findById(userId).populate([
            {
                path: 'conversations.conversation',
                strictPopulate: false,
                populate: { path: 'participants', select: 'userInfo.name userInfo.avatar online lastSeen authInfo.email authInfo.providerId, userInfo.username' }
            }
        ]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ conversations: user.conversations });
    }
    catch (error) {
        next(error);
    }
};
exports.getConversations = getConversations;
const deleteConversation = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { conversationId } = req.params;
        const existingUser = await User_model_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const conversationObjectId = new mongoose_1.default.Types.ObjectId(conversationId);
        const existingIndex = existingUser.conversations.findIndex((chat) => String(chat.conversation) === String(conversationObjectId));
        if (existingIndex === -1) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        existingUser.conversations.splice(existingIndex, 1);
        existingUser.markModified('conversations');
        await existingUser.save();
        return res.status(204).json({ message: 'Conversation deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteConversation = deleteConversation;
