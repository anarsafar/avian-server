import { Socket } from 'socket.io';
import { getIO } from './index';

const chatSocket = (socket: Socket): void => {
    const io = getIO();

    socket.on('chat-message', (message: string) => {
        io.emit('chat-message', { sender: socket.id, message });
    });

    // Add more event handlers as needed

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
};

export default chatSocket;
