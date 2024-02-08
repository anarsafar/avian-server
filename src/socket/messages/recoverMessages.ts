import { Socket } from 'socket.io';
import { getIO } from '..';
import getMessagesAfterOffset from './getMessagesAfterOffset';

const recoverMessages = async (socket: Socket): Promise<void> => {
    const io = getIO();
    if (!socket.recovered) {
        console.log('state-recovery', socket.handshake.auth);

        const room = socket.handshake.auth.room;
        const offset = socket.handshake.auth.serverOffset;

        try {
            if (room) {
                const messages = await getMessagesAfterOffset(offset, room);

                messages.forEach((message) => {
                    io.to(socket.id).emit('private message', {
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
        }
    }
};

export default recoverMessages;
