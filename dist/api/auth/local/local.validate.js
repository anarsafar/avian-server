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
exports.SignupValidate = exports.LoginValidate = void 0;
const z = __importStar(require("zod"));
exports.LoginValidate = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required.' })
        .email('Email is not a valid.')
        .transform((email) => email.toLowerCase()),
    password: z
        .string()
        .trim()
        .min(1, { message: 'Password is required.' })
        .min(8, 'Password must be at least 8 characters in length')
        .regex(new RegExp('.*[A-Z].*'), 'Password must include one uppercase character')
        .regex(new RegExp('.*[a-z].*'), 'Password must include one lowercase character')
        .regex(new RegExp('.*\\d.*'), 'Password must include one number')
        .regex(/[!@#$%^&*()]/, 'Password must include one special character')
});
exports.SignupValidate = exports.LoginValidate.extend({
    name: z
        .string()
        .trim()
        .min(1, { message: 'Name is required' })
        .min(3, 'Name must be at least 3 characters long')
        .refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: 'Must contain only letters and spaces'
    }),
    confirmPassword: z.string().trim().min(1, { message: 'confirm password is required' })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});
//# sourceMappingURL=local.validate.js.map