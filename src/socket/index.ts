import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

import corsOptions from '../config/cors';
import verifyAccess from './socket-helper/verifyAccess';
import updateUserStatus from './user/updateUserStatus';
import isUserTyping from './isUserTyping';
import chatSocket from './chatSocket';
import joinChat from './joinChat';

let io: SocketIOServer;

const userStatus = (socket: Socket, status: 'online' | 'offline') => {
    updateUserStatus(socket.data.userId, status);
    socket.broadcast.emit('refreshData', socket.data.userId);
};

export function initSocket(server: Server): void {
    io = new SocketIOServer(server, {
        cors: corsOptions,
        cookie: true,
        connectionStateRecovery: {}
    });

    // verify user middleware
    io.use((socket: Socket, next) => {
        const header = socket.handshake.headers.authorization;
        if (!verifyAccess(header, socket)) {
            return next(new Error('Authentication failed'));
        } else {
            next();
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        userStatus(socket, 'online');
        joinChat(socket);
        chatSocket(socket);
        isUserTyping(socket);

        socket.on('disconnect', () => {
            console.log('User disconnected');
            if (socket.data.userId) {
                userStatus(socket, 'offline');
            }
        });
    });
}

export function getIO(): SocketIOServer {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
}
