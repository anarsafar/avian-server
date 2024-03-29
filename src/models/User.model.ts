import { Document, Schema, model } from 'mongoose';
import * as z from 'zod';

const ContactSchema = z.object({
    user: z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
        message: 'Invalid ObjectId format'
    }),
    isBlocked: z.boolean().default(false),
    notification: z.boolean().default(true)
});

export type ContactSchema = z.infer<typeof ContactSchema>;

const localAuthInfo = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required.' })
        .email('Email is not a valid.')
        .transform((email) => email.toLowerCase()),
    password: z.string().min(1, { message: 'Password is required.' }),
    confirmationCode: z
        .string()
        .min(1, 'confirmation code is required')
        .max(6, 'confirmation code length exceeded')
        .length(6, 'confirmation code must be 6 digits long')
        .refine((code) => /^[a-zA-Z0-9]{6}$/.test(code)),
    confirmed: z.boolean().default(false),
    confirmationTimestamp: z.date().optional()
});

const socialAuthInfo = z.object({
    provider: z.union([z.literal('google'), z.literal('facebook'), z.literal('github')]),
    providerId: z.string().min(1, 'Provider id is required')
});

export const UserZodSchema = z.object({
    authType: z.union([z.literal('local'), z.literal('social')]),

    authInfo: z.custom((data: any) => {
        if (data.authType === 'local') {
            return localAuthInfo.parse(data);
        } else {
            return socialAuthInfo.parse(data);
        }
    }),

    userInfo: z.object({
        name: z
            .string()
            .trim()
            .min(1, { message: 'Name is required.' })
            .min(3, 'Name must be at least 3 characters long')
            .refine((value) => /^[A-Za-z\s]+$/.test(value), {
                message: 'Must contain only letters and spaces'
            }),
        bio: z.string().trim().min(1, { message: 'Bio is required.' }).min(3, 'Bio must be at least 3 characters long').default('').optional(),
        phone: z
            .string()
            .trim()
            .min(1, { message: 'Phone is required' })
            .regex(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Invalid phone number')
            .optional(),
        avatar: z.string().optional(),
        username: z
            .string()
            .trim()
            .min(3, 'Username must be at least 3 characters long')
            .refine((value) => /^[a-z0-9_]+$/.test(value), {
                message: 'Username must contain only lowercase letters, numbers, and underscores.'
            })
    }),

    resetPassword: z
        .object({
            confirmationCode: z
                .string()
                .min(1, 'confirmation code is required')
                .max(6, 'confirmation code length exceeded')
                .length(6, 'confirmation code must be 6 digits long')
                .refine((code) => /^[a-zA-Z0-9]{6}$/.test(code)),
            confirmed: z.boolean().default(false),
            confirmationTimestamp: z.date().optional()
        })
        .optional(),

    preferences: z.object({
        theme: z.union([z.literal('os'), z.literal('light'), z.literal('dark')])
    }),
    online: z.boolean().default(false).optional(),
    lastSeen: z.date().optional(),
    contacts: z.array(ContactSchema),
    notification: z.boolean().default(true),
    conversations: z.array(
        z.object({
            conversation: z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
                message: 'Invalid ObjectId format'
            }),
            muted: z.boolean().default(false),
            unread: z.number().default(0)
        })
    )
});

export type UserInterface = z.infer<typeof UserZodSchema> & Document;

const UserSchema = new Schema(
    {
        authType: {
            type: String,
            enum: ['local', 'social']
        },
        authInfo: {
            type: Object,
            required: true,
            properties: {
                email: {
                    type: String,
                    required: ['authType', 'local'],
                    trim: true,
                    email: true
                },
                password: {
                    type: String,
                    trim: true,
                    minlength: 8,
                    required: ['authType', 'local']
                },
                confirmationCode: {
                    type: String,
                    required: ['authType', 'local'],
                    trim: true,
                    minlength: 6,
                    maxlength: 6
                },
                confirmed: {
                    type: Boolean,
                    required: ['authType', 'local'],
                    default: false
                },
                provider: {
                    type: String,
                    enum: ['google', 'facebook', 'github'],
                    required: ['authType', 'social']
                },
                providerId: {
                    type: String,
                    required: ['authType', 'social']
                },
                confirmationTimestamp: {
                    type: Date,
                    required: ['authType', 'local']
                }
            }
        },
        userInfo: {
            type: Object,
            required: true,
            properties: {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 3
                },
                bio: {
                    type: String,
                    trim: true,
                    minlength: 3
                },
                phone: {
                    type: String,
                    trim: true,
                    minlength: 1,
                    match: /^(\+\d{1,2}\s?)?1?-?.?\s?\d{3}[\\s.-]?\d{3}[\\s.-]?\d{4}$/
                },
                avatar: {
                    type: String,
                    trim: true
                },
                username: {
                    type: String,
                    required: true
                }
            }
        },
        resetPassword: {
            type: Object,
            properties: {
                confirmationCode: {
                    type: String,
                    required: ['authType', 'local'],
                    trim: true
                },
                confirmed: {
                    type: String,
                    required: ['authType', 'local'],
                    trim: true
                },
                confirmationTimestamp: {
                    type: Date,
                    required: ['authType', 'local']
                }
            }
        },
        preferences: {
            type: Object,
            required: true,
            default: {
                theme: 'os'
            },
            properties: {
                theme: {
                    type: String
                }
            }
        },
        online: { type: Boolean, default: false },
        notification: { type: Boolean, default: true },
        lastSeen: { type: Date, default: Date.now },
        contacts: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                isBlocked: { type: Boolean, default: false },
                notification: { type: Boolean, default: true },
                _id: false
            }
        ],
        conversations: {
            type: [
                {
                    _id: false,
                    conversation: {
                        type: Schema.Types.ObjectId,
                        ref: 'Conversation',
                        required: true
                    },
                    muted: {
                        type: Boolean,
                        default: false
                    },
                    unread: {
                        type: Number,
                        default: 0
                    }
                }
            ],
            default: []
        }
    },
    {
        versionKey: false
    }
);

UserSchema.pre('save', function (next) {
    if (this.authType === 'local' && !this.resetPassword) {
        this.resetPassword = {
            confirmationCode: null,
            confirmed: false,
            confirmationTimestamp: null
        };
    }
    next();
});

const User = model<UserInterface & Document>('User', UserSchema);

export default User;
