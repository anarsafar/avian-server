import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import chatSocket from './chatSocket';
import corsOptions from '../config/cors';

let io: SocketIOServer;

export function initSocket(server: Server): void {
    io = new SocketIOServer(server, {
        cors: corsOptions
    });

    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        chatSocket(socket);
    });
}

export function getIO(): SocketIOServer {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
}
