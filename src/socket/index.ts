import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import chatSocket from './chatSocket';
import corsOptions from '../config/cors';
import verifyAccess from '../utils/verifyAccess';
import updateUserStatus from './updateUserStatus';

let io: SocketIOServer;

interface CustomSocket extends Socket {
    userId: string;
}

export function initSocket(server: Server): void {
    io = new SocketIOServer(server, {
        cors: corsOptions,
        cookie: true
    });

    // get user id from client
    io.use((socket: Socket, next) => {
        const header = socket.handshake.headers.authorization;
        if (!verifyAccess(header, socket)) {
            // If verification fails, emit an event to request a new access token
            socket.emit('requestNewAccessToken');
        }
        return next();
    });

    io.on('connection', (socket: Socket) => {
        console.log('A user connected');
        const customSocket = socket as CustomSocket;

        updateUserStatus(customSocket.userId, 'online');
        chatSocket(socket);

        // if refresh token fails to generate new access token then terminate session
        socket.on('tokenError', () => {
            socket.disconnect();
        });

        socket.on('disconnect', () => {
            updateUserStatus(customSocket.userId, 'offline');
            console.log('User disconnected');
        });
    });
}

export function getIO(): SocketIOServer {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
}
