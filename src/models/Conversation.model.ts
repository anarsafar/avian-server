import { Schema, model, Document } from 'mongoose';
import * as z from 'zod';

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

export type ConversationI = z.infer<typeof ConversationI>;

const ConversationSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
        type: { type: String, enum: ['private', 'group'], default: 'private' },
        conversationName: { type: String },
        conversationCover: { type: String },
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message', index: true }],
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
        admin: { type: Schema.Types.ObjectId, ref: 'User', index: true }
    },
    {
        versionKey: false
    }
);

const Conversation = model<ConversationI & Document>('Conversation', ConversationSchema);

export default Conversation;
