import { Schema } from 'mongoose';
import { MessageSchema } from './Message.model';

export const ConversationSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        type: { type: String, enum: ['private', 'group'], default: 'private' },
        conversationName: { type: String, required: true },
        conversationCover: { type: String, required: true },
        messages: [MessageSchema]
    },
    {
        versionKey: false
    }
);
