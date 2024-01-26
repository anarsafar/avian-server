import { Socket } from 'socket.io';

function isUserTyping(socket: Socket): void {
    socket.on('typing', (userId: string) => {
        socket.broadcast.emit('typing', userId);
    });

    socket.on('stop typing', (userId: string) => {
        socket.broadcast.emit('stop typing', userId);
    });
}

export default isUserTyping;
