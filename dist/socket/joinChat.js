"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateRoomId_1 = __importDefault(require("./socket-helper/generateRoomId"));
const joinChat = (socket) => {
    socket.on('join-private-chat', async (conversationId, senderId, recipientId) => {
        socket.rooms.forEach((room) => (room !== socket.id ? socket.leave(room) : null));
        if (conversationId) {
            socket.join(conversationId);
        }
        if (senderId && recipientId) {
            const roomIdentifier = (0, generateRoomId_1.default)(senderId, recipientId);
            socket.join(roomIdentifier);
        }
    });
};
exports.default = joinChat;
//# sourceMappingURL=joinChat.js.map