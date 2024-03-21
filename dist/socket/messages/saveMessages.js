"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Conversation_model_1 = __importDefault(require("../../models/Conversation.model"));
const Message_model_1 = __importDefault(require("../../models/Message.model"));
const saveMessages = async (message, senderId, recipientId, conversationId) => {
    const newMessage = {
        sender: senderId,
        recipients: [recipientId, senderId],
        timestamp: message.timeStamp,
        content: message.messageBody,
        conversation: conversationId,
        isRead: false
    };
    const createdMessage = await Message_model_1.default.create(newMessage);
    // Update the conversation with the new message
    const existingConversation = await Conversation_model_1.default.findById(conversationId);
    if (existingConversation) {
        existingConversation.cardData = {
            lastMessageSender: senderId,
            lastMessageContent: message.messageBody,
            lastMessageDate: message.timeStamp
        };
        existingConversation.messages.push(createdMessage._id);
        existingConversation.markModified('cardData');
        existingConversation.markModified('messages');
        existingConversation.save();
    }
    return newMessage;
};
exports.default = saveMessages;
