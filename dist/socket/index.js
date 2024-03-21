"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("../config/cors"));
const verifyAccess_1 = __importDefault(require("./socket-helper/verifyAccess"));
const updateUserStatus_1 = __importDefault(require("./user/updateUserStatus"));
const isUserTyping_1 = __importDefault(require("./isUserTyping"));
const chatSocket_1 = __importDefault(require("./chatSocket"));
const joinChat_1 = __importDefault(require("./joinChat"));
const recoverMessages_1 = __importDefault(require("./messages/recoverMessages"));
const readMessage_1 = __importDefault(require("./readMessage"));
let io;
const userStatus = (socket, status) => {
    (0, updateUserStatus_1.default)(socket.data.userId, status);
    socket.broadcast.emit('refreshData', socket.data.userId);
};
function initSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: cors_1.default,
        cookie: true,
        connectionStateRecovery: {}
    });
    // verify user middleware
    io.use((socket, next) => {
        const header = socket.handshake.headers.authorization;
        if (!(0, verifyAccess_1.default)(header, socket)) {
            return next(new Error('Authentication failed'));
        }
        else {
            next();
        }
    });
    io.on('connection', async (socket) => {
        console.log('A user connected');
        userStatus(socket, 'online');
        (0, joinChat_1.default)(socket);
        (0, chatSocket_1.default)(socket);
        (0, isUserTyping_1.default)(socket);
        (0, recoverMessages_1.default)(socket);
        (0, readMessage_1.default)(socket);
        socket.on('disconnect', () => {
            console.log('User disconnected');
            if (socket.data.userId) {
                userStatus(socket, 'offline');
            }
        });
    });
}
exports.initSocket = initSocket;
function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
}
exports.getIO = getIO;
