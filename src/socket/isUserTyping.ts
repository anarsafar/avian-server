import { Socket } from 'socket.io';

interface TypingI {
    userId: string;
    conversationId: string;
}

function isUserTyping(socket: Socket): void {
    socket.on('typing', ({ userId, conversationId }: TypingI) => {
        socket.to(conversationId).emit('typing', userId);
    });

    socket.on('stop typing', ({ userId, conversationId }: TypingI) => {
        socket.to(conversationId).emit('stop typing', userId);
    });
}

export default isUserTyping;
