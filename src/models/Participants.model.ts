import { Schema, model, Document, Types } from 'mongoose';
import * as z from 'zod';

const objectId = z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
    message: 'Invalid ObjectId format'
});

const ParticipantI = z.object({
    participant: objectId,
    isAdmin: z.boolean().default(false),
    unreadCount: z.number(),
    isArchived: z.boolean().default(false),
    conversation: objectId
});

export type ParticipantI = z.infer<typeof ParticipantI>;

export const ParticipantSchema = new Schema(
    {
        participant: { type: Types.ObjectId, ref: 'User', required: true, index: true },
        isAdmin: { type: Boolean, default: false },
        unreadCount: { type: Number, default: 0 },
        isArchived: { type: Boolean, default: false },
        conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', index: true, required: true }
    },
    {
        versionKey: false
    }
);

const Participant = model<ParticipantI & Document>('Participants', ParticipantSchema);

export default Participant;
