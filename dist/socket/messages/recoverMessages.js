"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const getMessagesAfterOffset_1 = __importDefault(require("./getMessagesAfterOffset"));
const recoverMessages = async (socket) => {
    const io = (0, __1.getIO)();
    if (!socket.recovered) {
        console.log('state-recovery', socket.handshake.auth);
        const room = socket.handshake.auth.room;
        const offset = socket.handshake.auth.serverOffset;
        try {
            if (room) {
                const messages = await (0, getMessagesAfterOffset_1.default)(offset, room);
                messages.forEach((message) => {
                    io.to(socket.id).emit('private message', message);
                });
            }
        }
        catch (e) {
            console.error('Error during state recovery:', e);
        }
    }
};
exports.default = recoverMessages;
