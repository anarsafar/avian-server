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
exports.UpdateUserValidate = void 0;
const z = __importStar(require("zod"));
const emptyObjectSchema = z.object({}).strict();
const isEmpty = (obj) => {
    const result = emptyObjectSchema.safeParse(obj);
    return result.success;
};
exports.UpdateUserValidate = z
    .object({
    name: z
        .string()
        .trim()
        .min(1, { message: 'Name is required.' })
        .min(3, 'Name must be at least 3 characters long')
        .refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: 'Must contain only letters and spaces'
    })
        .optional(),
    bio: z.string().trim().min(1, { message: 'Bio is required.' }).min(3, 'Bio must be at least 3 characters long').optional(),
    phone: z
        .string()
        .trim()
        .min(1, { message: 'Phone is required' })
        .regex(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Invalid phone number')
        .default('')
        .optional(),
    avatar: z.unknown().optional(),
    theme: z.union([z.literal('os'), z.literal('light'), z.literal('dark')]).optional(),
    username: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters long')
        .refine((value) => /^[a-z0-9_]+$/.test(value), {
        message: 'Username must contain only lowercase letters, numbers, and underscores'
    })
        .optional()
})
    .refine((data) => !isEmpty(data), { message: 'Body can not be empty' });
//# sourceMappingURL=user.validate.js.map