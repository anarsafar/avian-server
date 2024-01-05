import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipients: [{ type: Schema.Types.ObjectId, ref: 'Participants', required: true, index: true }],
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    isRead: { type: Boolean, default: false }
});
