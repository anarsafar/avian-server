import Conversation from '../../models/Conversation.model';
import Message, { MessageI } from '../../models/Message.model';

interface MsgI {
    messageBody: string;
    timeStamp: Date;
}

const saveMessages = async (message: MsgI, senderId: string, recipientId: string, conversationId: string): Promise<MessageI> => {
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
    const existingConversation = await Conversation.findById(conversationId);

    if (existingConversation) {
        existingConversation.cardData = {
            lastMessageSender: senderId,
            lastMessageContent: message.messageBody,
            lastMessageDate: message.timeStamp
        };

        existingConversation.messages.push(createdMessage._id);

        existingConversation.markModified('cardData');
        existingConversation.markModified('messages');

        existingConversation.save();
    }

    return newMessage;
};

export default saveMessages;
