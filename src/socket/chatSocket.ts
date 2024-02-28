import { Socket } from 'socket.io';
import { ObjectId } from 'mongodb';

import { getIO } from './index';
import Conversation, { ConversationI } from '../models/Conversation.model';
import updateUsersConversations from './user/updateUser';
import generateRoomIdentifier from './socket-helper/generateRoomId';
import saveMessages from './messages/saveMessages';

interface MsgI {
    messageBody: string;
    timeStamp: Date;
}

interface PrivateMessage {
    message: MsgI;
    senderId: string;
    recipientId: string;
    chatId?: string;
}

const chatSocket = (socket: Socket): void => {
    const io = getIO();

    socket.on('private message', async ({ message, senderId, recipientId, chatId }: PrivateMessage) => {
        let conversationId: string;

        const existingConversation = chatId
            ? await Conversation.findById(chatId)
            : await Conversation.findOne({
                  participants: { $all: [senderId, recipientId] }
              });

        if (!existingConversation) {
            const newConversation: ConversationI = {
                participants: [senderId, recipientId],
                type: 'private',
                messages: []
            };

            const createdConversation = await Conversation.create(newConversation);
            conversationId = createdConversation._id;
        } else {
            conversationId = existingConversation._id;
        }

        const objectId = new ObjectId(conversationId);
        const conversationIdString = objectId.toHexString();

        const roomIdentifier = chatId ? conversationIdString : generateRoomIdentifier(senderId, recipientId);

        const newMessage = await saveMessages(message, senderId, recipientId, conversationId);
        updateUsersConversations([senderId, recipientId], conversationId);

        io.emit('notification', senderId, recipientId);
        io.to(roomIdentifier).emit('private message', newMessage);

        // invalidate conversations on front-end
        io.emit('update-conversations', recipientId);
    });
};

export default chatSocket;
