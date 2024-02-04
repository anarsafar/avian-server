import { Socket } from 'socket.io';

function isUserTyping(socket: Socket): void {
    socket.on('typing', (userId: string, roomId: string) => {
        socket.to(roomId).emit('typing', userId);
    });

    socket.on('stop typing', (userId: string, roomId: string) => {
        socket.to(roomId).emit('stop typing', userId);
    });
}

export default isUserTyping;
