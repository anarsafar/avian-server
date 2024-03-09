import { Socket } from 'socket.io';
import Message from '../models/Message.model';
import { getIO } from '.';
import mongoose from 'mongoose';
import User from '../models/User.model';

const readMessage = (socket: Socket): void => {
    const io = getIO();

    socket.on('mark-as-read', async (messageId: string, userId: string, roomId: string, senderId: string) => {
        const existingMessage = await Message.findById(messageId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        if (existingMessage && String(existingMessage.sender) !== String(userObjectId) && !existingMessage.isRead) {
            existingMessage.isRead = true;
            existingMessage.save();

            io.to(roomId).emit('update-messages', existingMessage?.sender);

            const user = await User.findById(userId);
            const roomObjectId = new mongoose.Types.ObjectId(roomId);
            const senderObjectId = new mongoose.Types.ObjectId(senderId);

            const messages = await Message.find({ conversation: roomObjectId, isRead: false, sender: senderObjectId });

            if (user) {
                const newConversationList = user.conversations.map((chat) => {
                    if (String(chat.conversation) === String(roomObjectId)) {
                        chat.unread = messages.length;
                    }
                    return chat;
                });

                user.conversations = newConversationList;
                user.markModified('conversations');
                user.save();
            }

            io.emit('update-conversations', userId, senderId);
        }
    });
};

export default readMessage;
