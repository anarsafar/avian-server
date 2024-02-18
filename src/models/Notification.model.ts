import { Schema, model, Document } from 'mongoose';
import * as z from 'zod';

const objectId = z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
    message: 'Invalid ObjectId format'
});

const NotificationI = z.object({
    userId: objectId,
    type: z.union([z.literal('reset'), z.literal('login'), z.literal('group')]),
    osInfo: z.string().min(1, 'OS info required'),
    location: z
        .object({
            latitude: z.number().min(1, 'latitude is required'),
            longitude: z.number().min(1, 'ongitude is required')
        })
        .optional(),
    browserInfo: z.string(),
    timestamp: z.date().default(new Date())
});

export type NotificationI = z.infer<typeof NotificationI>;

const NotificationSchema = new Schema({
    userId: { type: String, required: true, index: true },
    type: {
        type: String,
        enum: ['reset', 'login', 'group'],
        require: true
    },
    osInfo: { type: String, require: true, minlength: 1, trim: true },
    browserInfo: { type: String, require: true, minlength: 1, trim: true },
    location: {
        type: Object,
        properties: {
            latitude: {
                type: Number,
                trim: true,
                minlength: 1
            },
            longitude: {
                type: Number,
                trim: true,
                minlength: 1
            }
        }
    },
    timestamp: { type: Date, default: Date.now, require: true }
});

const Notification = model<NotificationI & Document>('Notification', NotificationSchema);

export default Notification;
