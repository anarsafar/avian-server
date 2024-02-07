import { Socket } from 'socket.io';

import generateRoomIdentifier from './socket-helper/generateRoomId';
import getMessagesAfterOffset from './messages/recoverMessages';
import { getIO } from '.';

interface CustomSocket extends Socket {
    recovered: boolean;
}

const joinChat = (socket: CustomSocket): void => {
    const io = getIO();

    socket.on('join-private-chat', async (conversationId: string | undefined, senderId: string, recipientId: string) => {
        socket.rooms.forEach((room) => (room !== socket.id ? socket.leave(room) : null));

        if (conversationId) {
            socket.join(conversationId);
        }

        if (senderId && recipientId) {
            const roomIdentifier = generateRoomIdentifier(senderId, recipientId);
            socket.join(roomIdentifier);
        }

        if (!socket.recovered) {
            const roomIdentifier = conversationId ? conversationId : generateRoomIdentifier(senderId, recipientId);
            console.log('state-recovery', socket.handshake.auth.serverOffset, roomIdentifier, conversationId);
            try {
                if (conversationId) {
                    const messages = await getMessagesAfterOffset(socket.handshake.auth.serverOffset || Date.now(), conversationId);

                    messages.forEach((message) => {
                        io.to(roomIdentifier).emit('private message', {
                            message: {
                                messageBody: message.content,
                                timeStamp: message.timestamp
                            },
                            senderId: message.sender
                        });
                    });
                }
            } catch (e) {
                console.error('Error during state recovery:', e);
            } finally {
                socket.recovered = true;
            }
        }
    });
};

export default joinChat;
