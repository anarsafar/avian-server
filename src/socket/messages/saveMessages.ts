import Conversation from '../../models/Conversation.model';
import Message, { MessageI } from '../../models/Message.model';

interface MsgI {
    messageBody: string;
    timeStamp: Date;
}

const saveMessages = async (message: MsgI, senderId: string, recipientId: string, conversationId: string): Promise<void> => {
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
};

export default saveMessages;
