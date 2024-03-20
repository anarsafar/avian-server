"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_model_1 = __importDefault(require("../../models/Message.model"));
const getMessagesAfterOffset = async (offset, conversation) => {
    try {
        const messages = await Message_model_1.default.find({ timestamp: { $gt: offset }, conversation });
        return messages;
    }
    catch (error) {
        throw new Error(`Error retrieving messages: ${String(error)}`);
    }
};
exports.default = getMessagesAfterOffset;
//# sourceMappingURL=getMessagesAfterOffset.js.map