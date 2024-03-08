import User from '../../models/User.model';

const updateUsersConversations = async (userIds: string[], conversationId: string, recipientId: string): Promise<void> => {
    try {
        const users = await User.find({ _id: { $in: userIds } });
        for (const user of users) {
            const existingIndex = user.conversations.findIndex((chat) => String(chat?.conversation) === String(conversationId));

            if (existingIndex === -1) {
                user.conversations.unshift({
                    conversation: conversationId,
                    muted: false,
                    unread: user._id == recipientId ? 1 : 0
                });
            } else {
                const conversation = user.conversations.at(existingIndex);

                user.conversations.splice(existingIndex, 1);

                // if (conversation && user._id == recipientId) {
                //     conversation.unread = ++conversation.unread;
                // }

                if (conversation) {
                    user.conversations.unshift(conversation);
                }
            }

            user.markModified('conversations');
            await user.save();
        }
    } catch (error) {
        console.error("Error updating users' conversations array:", error);
    }
};

export default updateUsersConversations;
