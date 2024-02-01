import { Socket } from 'socket.io';
import { getIO } from './index';
import Conversation, { ConversationI } from '../models/Conversation.model';
import Message, { MessageI } from '../models/Message.model';
import { ObjectId } from 'mongodb';
import updateUsersConversations from './socket-helper/updateUser';

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

const generateRoomIdentifier = (senderId: string, recipientId: string): string => {
    const sortedUserIds = [senderId, recipientId].sort();
    return `${sortedUserIds[0]}-${sortedUserIds[1]}`;
};

const chatSocket = (socket: Socket): void => {
    const io = getIO();

    socket.on('join-private-chat', (conversationId: string | undefined, senderId: string, recipientId: string) => {
        if (conversationId) {
            console.log(conversationId);
            socket.join(conversationId);
        }

        if (senderId && recipientId) {
            const roomIdentifier = generateRoomIdentifier(senderId, recipientId);
            console.log(roomIdentifier);
            socket.join(roomIdentifier);
        }
    });

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

        //send message before saving to DB
        io.to(roomIdentifier).emit('private message', { message, senderId });

        // save message to DB
        const newMessage: MessageI = {
            sender: senderId,
            recipients: [recipientId, senderId],
            timestamp: message.timeStamp,
            content: message.messageBody,
            conversation: conversationId,
            isRead: false
        };

        const createdMessage = await Message.create(newMessage);

        // Update the conversation with the new message
        await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: createdMessage._id } }, { new: true });

        // update user conversation
        updateUsersConversations([senderId, recipientId], conversationId);
    });
};

export default chatSocket;
