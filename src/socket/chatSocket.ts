import { Socket } from 'socket.io';
import { getIO } from './index';

const chatSocket = (socket: Socket): void => {
    const io = getIO();

    socket.on('private message', (message: string) => {
        // io.emit('chat-message', { sender: socket.id, message });
        console.log('message: ' + message);
        io.emit('private message', message);
    });
};

export default chatSocket;
