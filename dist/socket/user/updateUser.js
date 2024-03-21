"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const Message_model_1 = __importDefault(require("../../models/Message.model"));
const updateUsersConversations = async (userIds, conversationId, recipientId, senderId) => {
    try {
        const users = await User_model_1.default.find({ _id: { $in: userIds } });
        for (const user of users) {
            const existingIndex = user.conversations.findIndex((chat) => String(chat?.conversation) === String(conversationId));
            if (existingIndex === -1) {
                user.conversations.unshift({
                    conversation: conversationId,
                    muted: false,
                    unread: user._id == recipientId ? 1 : 0
                });
            }
            else {
                const conversation = user.conversations.at(existingIndex);
                user.conversations.splice(existingIndex, 1);
                if (conversation && user._id == recipientId) {
                    const roomObjectId = new mongoose_1.default.Types.ObjectId(conversationId);
                    const senderObjectId = new mongoose_1.default.Types.ObjectId(senderId);
                    const messages = await Message_model_1.default.find({ conversation: roomObjectId, isRead: false, sender: senderObjectId });
                    conversation.unread = messages.length;
                }
                if (conversation) {
                    user.conversations.unshift(conversation);
                }
            }
            user.markModified('conversations');
            await user.save();
        }
    }
    catch (error) {
        console.error("Error updating users' conversations array:", error);
    }
};
exports.default = updateUsersConversations;
