"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUserTyping(socket) {
    socket.on('typing', (userId, roomId) => {
        socket.to(roomId).emit('typing', userId);
    });
    socket.on('stop typing', (userId, roomId) => {
        socket.to(roomId).emit('stop typing', userId);
    });
}
exports.default = isUserTyping;
