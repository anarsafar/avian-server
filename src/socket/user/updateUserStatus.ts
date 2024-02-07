import User from '../../models/User.model';

const updateUserStatus = async (userId: string, status: 'online' | 'offline'): Promise<void> => {
    let existingUser = await User.findById(userId).exec();

    if (!existingUser) {
        throw new Error('User not found');
    }

    existingUser.online = status === 'online';

    if (status === 'offline') {
        existingUser.lastSeen = new Date();
    }

    await existingUser.save();
};

export default updateUserStatus;
