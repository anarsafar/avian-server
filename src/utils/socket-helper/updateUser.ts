import User from '../../models/User.model';

const updateUsersConversations = async (userIds: string[], conversationId: string): Promise<void> => {
    try {
        const users = await User.find({ _id: { $in: userIds } });
        for (const user of users) {
            if (user.conversations.indexOf(conversationId) === -1) {
                user.conversations.push(conversationId);
                user.markModified('conversations');
                await user.save();
            }
        }
    } catch (error) {
        console.error("Error updating users' conversations array:", error);
    }
};

export default updateUsersConversations;
