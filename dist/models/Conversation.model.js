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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const z = __importStar(require("zod"));
const objectId = z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
    message: 'Invalid ObjectId format'
});
const ConversationI = z.object({
    participants: z.array(objectId),
    type: z.union([z.literal('private'), z.literal('group')]).default('private'),
    conversationName: z.string().optional(),
    conversationCover: z.string().optional(),
    messages: z.array(objectId).default([]),
    cardData: z.object({
        lastMessageSender: objectId.optional(),
        lastMessageContent: z.string().default(''),
        lastMessageDate: z.date().optional()
    }),
    admin: objectId.optional()
});
const ConversationSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    type: { type: String, enum: ['private', 'group'], default: 'private' },
    conversationName: { type: String },
    conversationCover: { type: String },
    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message', index: true }],
    cardData: {
        type: 'Object',
        required: true,
        properties: {
            lastMessageSender: {
                type: String,
                required: false
            },
            lastMessageContent: {
                type: String,
                required: false
            },
            lastMessageDate: {
                type: Date,
                required: false
            }
        }
    },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true }
}, {
    versionKey: false
});
const Conversation = (0, mongoose_1.model)('Conversation', ConversationSchema);
exports.default = Conversation;
//# sourceMappingURL=Conversation.model.js.map