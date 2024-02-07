import Message from '../../models/Message.model';

const getMessagesAfterOffset = async (offset: number, conversation: string) => {
    try {
        const messages = await Message.find({ timestamp: { $gt: new Date(offset) }, conversation });

        return messages;
    } catch (error) {
        throw new Error(`Error retrieving messages: ${String(error)}`);
    }
};

export default getMessagesAfterOffset;
