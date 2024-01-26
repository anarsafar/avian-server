import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import chatSocket from './chatSocket';
import corsOptions from '../config/cors';
import verifyAccess from '../utils/verifyAccess';
import updateUserStatus from './updateUserStatus';
import isUserTyping from './isUserTyping';

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
            const err = new Error('not authorized');
            next(err);
        } else {
            return next();
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('A user connected');
        const customSocket = socket as CustomSocket;

        updateUserStatus(customSocket.userId, 'online');
        socket.broadcast.emit('refreshData', customSocket.userId);

        chatSocket(customSocket);
        isUserTyping(customSocket);

        socket.on('disconnect', () => {
            console.log('User disconnected');
            updateUserStatus(customSocket.userId, 'offline');
            // ping other users to refresh their data
            socket.broadcast.emit('refreshData', customSocket.userId);
        });
    });
}

export function getIO(): SocketIOServer {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
}
