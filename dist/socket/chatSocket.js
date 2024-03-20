"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const index_1 = require("./index");
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
const updateUser_1 = __importDefault(require("./user/updateUser"));
const generateRoomId_1 = __importDefault(require("./socket-helper/generateRoomId"));
const saveMessages_1 = __importDefault(require("./messages/saveMessages"));
const chatSocket = (socket) => {
    const io = (0, index_1.getIO)();
    socket.on('private message', async ({ message, senderId, recipientId, chatId }) => {
        let conversationId;
        const existingConversation = chatId
            ? await Conversation_model_1.default.findById(chatId)
            : await Conversation_model_1.default.findOne({
                participants: { $all: [senderId, recipientId] }
            });
        if (!existingConversation) {
            const newConversation = {
                participants: [senderId, recipientId],
                type: 'private',
                messages: [],
                cardData: {
                    lastMessageContent: message.messageBody,
                    lastMessageSender: senderId,
                    lastMessageDate: message.timeStamp
                }
            };
            const createdConversation = await Conversation_model_1.default.create(newConversation);
            conversationId = createdConversation._id;
        }
        else {
            conversationId = existingConversation._id;
        }
        const objectId = new mongodb_1.ObjectId(conversationId);
        const conversationIdString = objectId.toHexString();
        const roomIdentifier = chatId ? conversationIdString : (0, generateRoomId_1.default)(senderId, recipientId);
        const newMessage = await (0, saveMessages_1.default)(message, senderId, recipientId, conversationId);
        (0, updateUser_1.default)([senderId, recipientId], conversationId, recipientId, senderId);
        io.emit('notification', senderId, recipientId);
        io.to(roomIdentifier).emit('private message', newMessage);
        // invalidate conversations on front-end
        io.emit('update-conversations', recipientId, senderId);
    });
};
exports.default = chatSocket;
//# sourceMappingURL=chatSocket.js.map