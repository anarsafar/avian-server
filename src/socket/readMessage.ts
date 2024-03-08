import { Socket } from 'socket.io';
import Message from '../models/Message.model';
import { getIO } from '.';
import mongoose from 'mongoose';
// import User from '../models/User.model';

const readMessage = (socket: Socket): void => {
    const io = getIO();

    socket.on('mark-as-read', async (messageId: string, userId: string, roomId: string) => {
        const existingMessage = await Message.findById(messageId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        if (existingMessage && String(existingMessage.sender) !== String(userObjectId) && !existingMessage.isRead) {
            existingMessage.isRead = true;
            existingMessage.save();

            // const user = await User.findById(userId);

            // if (user) {
            //     const conversations = user.conversations.map((chat) => {
            //         const roomIdObject = new mongoose.Types.ObjectId(roomId);

            //         if (String(chat.conversation) === String(roomIdObject) && chat.unread > 0) {
            //             chat.unread = chat.unread - 1;
            //         }

            //         return chat;
            //     });

            //     user.conversations = conversations;
            //     user.markModified('conversations');
            //     user.save();
            // }

            io.to(roomId).emit('update-messages', existingMessage?.sender);
        }
    });
};

export default readMessage;
