"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZodSchema = void 0;
const mongoose_1 = require("mongoose");
const z = __importStar(require("zod"));
const ContactSchema = z.object({
    user: z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
        message: 'Invalid ObjectId format'
    }),
    isBlocked: z.boolean().default(false),
    notification: z.boolean().default(true)
});
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
exports.UserZodSchema = z.object({
    authType: z.union([z.literal('local'), z.literal('social')]),
    authInfo: z.custom((data) => {
        if (data.authType === 'local') {
            return localAuthInfo.parse(data);
        }
        else {
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
    conversations: z.array(z.object({
        conversation: z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
            message: 'Invalid ObjectId format'
        }),
        muted: z.boolean().default(false),
        unread: z.number().default(0)
    }))
});
const UserSchema = new mongoose_1.Schema({
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
            user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
                    type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    versionKey: false
});
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
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
