import { Schema, model, Document } from 'mongoose';
import * as z from 'zod';

const objectId = z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
    message: 'Invalid ObjectId format'
});

const MessageI = z.object({
    sender: objectId,
    recipients: z.array(objectId),
    content: z.string(),
    timestamp: z.date().default(new Date()),
    conversation: objectId,
    isRead: z.boolean().default(false)
});

export type MessageI = z.infer<typeof MessageI>;

const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipients: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    isRead: { type: Boolean, default: false }
});

const Message = model<MessageI & Document>('Message', MessageSchema);

export default Message;
