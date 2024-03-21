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
const mongoose_1 = require("mongoose");
const z = __importStar(require("zod"));
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
const NotificationSchema = new mongoose_1.Schema({
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
const Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.default = Notification;
