import Message from '../../models/Message.model';

const getMessagesAfterOffset = async (offset: Date, conversation: string) => {
    try {
        const messages = await Message.find({ timestamp: { $gt: offset }, conversation });

        return messages;
    } catch (error) {
        throw new Error(`Error retrieving messages: ${String(error)}`);
    }
};

export default getMessagesAfterOffset;
