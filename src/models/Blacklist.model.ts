import { Schema, model, Document } from 'mongoose';
import { z } from 'zod';

export const BlackListZodSchema = z.object({
    token: z.string(),
    expiration: z.date(),
    type: z.enum(['refresh', 'access'])
});

export type BlackListInterface = z.infer<typeof BlackListZodSchema>;

const blacklistSchema = new Schema({
    token: { type: String, required: true },
    expiration: { type: Date, required: true },
    type: { type: String, required: true }
});

blacklistSchema.index({ expiration: 1 });

const BlacklistToken = model<BlackListInterface & Document>('BlacklistToken', blacklistSchema);

export default BlacklistToken;
