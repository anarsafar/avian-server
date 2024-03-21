"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackListZodSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.BlackListZodSchema = zod_1.z.object({
    token: zod_1.z.string(),
    expiration: zod_1.z.date(),
    type: zod_1.z.enum(['refresh', 'access'])
});
const blacklistSchema = new mongoose_1.Schema({
    token: { type: String, required: true },
    expiration: { type: Date, required: true },
    type: { type: String, required: true }
});
blacklistSchema.index({ expiration: 1 });
const BlacklistToken = (0, mongoose_1.model)('BlacklistToken', blacklistSchema);
exports.default = BlacklistToken;
