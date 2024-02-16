import { Socket } from 'socket.io';

import generateRoomIdentifier from './socket-helper/generateRoomId';

interface CustomSocket extends Socket {
    recovered: boolean;
}

const joinChat = (socket: CustomSocket): void => {
    socket.on('join-private-chat', async (conversationId: string | undefined, senderId: string, recipientId: string) => {
        socket.rooms.forEach((room) => (room !== socket.id ? socket.leave(room) : null));

        if (conversationId) {
            socket.join(conversationId);
        }

        if (senderId && recipientId) {
            const roomIdentifier = generateRoomIdentifier(senderId, recipientId);
            socket.join(roomIdentifier);
        }
    });
};

export default joinChat;
