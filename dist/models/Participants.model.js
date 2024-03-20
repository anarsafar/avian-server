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
exports.ParticipantSchema = void 0;
const mongoose_1 = require("mongoose");
const z = __importStar(require("zod"));
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
exports.ParticipantSchema = new mongoose_1.Schema({
    participant: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true, index: true },
    isAdmin: { type: Boolean, default: false },
    unreadCount: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
    conversation: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Conversation', index: true, required: true }
}, {
    versionKey: false
});
const Participant = (0, mongoose_1.model)('Participants', exports.ParticipantSchema);
exports.default = Participant;
//# sourceMappingURL=Participants.model.js.map