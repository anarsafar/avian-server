import { Schema, model, Types } from 'mongoose';

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

export const ParticipantModel = model('Participants', ParticipantSchema);
