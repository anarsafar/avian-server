"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_model_1 = __importDefault(require("../models/Message.model"));
const _1 = require(".");
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../models/User.model"));
const readMessage = (socket) => {
    const io = (0, _1.getIO)();
    socket.on('mark-as-read', async (messageId, userId, roomId, senderId) => {
        const existingMessage = await Message_model_1.default.findById(messageId);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        if (existingMessage && String(existingMessage.sender) !== String(userObjectId) && !existingMessage.isRead) {
            existingMessage.isRead = true;
            existingMessage.save();
            io.to(roomId).emit('update-messages', existingMessage?.sender);
            const user = await User_model_1.default.findById(userId);
            const roomObjectId = new mongoose_1.default.Types.ObjectId(roomId);
            const senderObjectId = new mongoose_1.default.Types.ObjectId(senderId);
            const messages = await Message_model_1.default.find({ conversation: roomObjectId, isRead: false, sender: senderObjectId });
            if (user) {
                const newConversationList = user.conversations.map((chat) => {
                    if (String(chat.conversation) === String(roomObjectId)) {
                        chat.unread = messages.length;
                    }
                    return chat;
                });
                user.conversations = newConversationList;
                user.markModified('conversations');
                user.save();
            }
            io.emit('update-conversations', userId, senderId);
        }
    });
};
exports.default = readMessage;
//# sourceMappingURL=readMessage.js.map