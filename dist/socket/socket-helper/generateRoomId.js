"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRoomIdentifier = (senderId, recipientId) => {
    const sortedUserIds = [senderId, recipientId].sort();
    return `${sortedUserIds[0]}-${sortedUserIds[1]}`;
};
exports.default = generateRoomIdentifier;
//# sourceMappingURL=generateRoomId.js.map