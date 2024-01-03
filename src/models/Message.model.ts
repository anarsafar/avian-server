import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipients: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
