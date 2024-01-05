import { Schema } from 'mongoose';

export const ConversationSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'Participants', required: true, index: true }],
        type: { type: String, enum: ['private', 'group'], default: 'private' },
        conversationName: { type: String, required: true },
        conversationCover: { type: String, required: true },
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message', index: true }],
        admin: { type: Schema.Types.ObjectId, ref: 'User', index: true }
    },
    {
        versionKey: false
    }
);
