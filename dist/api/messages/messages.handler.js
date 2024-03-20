"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.getMessages = void 0;
const Message_model_1 = __importDefault(require("../../models/Message.model"));
const Conversation_model_1 = __importDefault(require("../../models/Conversation.model"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const saveMessages_1 = __importDefault(require("../../socket/messages/saveMessages"));
const getMessages = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 20 } = req.query;
        const { conversationId } = req.params;
        const conversation = await Conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        const totalItems = conversation.messages.length;
        const totalPages = Math.ceil(totalItems / Number(pageSize));
        const messages = await Message_model_1.default.find({ conversation: conversationId })
            .sort({ timestamp: -1 })
            .skip((Number(page) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .exec();
        if (!messages) {
            return res.status(404).json({ error: 'Messages not found' });
        }
        return res.json({
            messages,
            pagination: {
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages,
                totalItems
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessages = getMessages;
const addMessage = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { senderId, recipientId, message, chatId } = req.body;
        const existingUser = await User_model_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User does not exist' });
        }
        const msg = await (0, saveMessages_1.default)(message, senderId, recipientId, chatId);
        if (msg) {
            return res.status(201).json(msg);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addMessage = addMessage;
//# sourceMappingURL=messages.handler.js.map