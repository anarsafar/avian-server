import { Socket } from 'socket.io';
import Message from '../models/Message.model';
import { getIO } from '.';
import mongoose from 'mongoose';

const readMessage = (socket: Socket): void => {
    const io = getIO();

    socket.on('mark-as-read', async (messageId: string, userId: string, roomId: string) => {
        const existingMessage = await Message.findById(messageId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        if (existingMessage && String(existingMessage.sender) !== String(userObjectId) && !existingMessage.isRead) {
            existingMessage.isRead = true;
            existingMessage.save();

            io.to(roomId).emit('update-messages', existingMessage?.sender);
        }
    });
};

export default readMessage;
