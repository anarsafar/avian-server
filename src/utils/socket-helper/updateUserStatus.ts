import User from '../../models/User.model';

const updateUserStatus = async (userId: string, status: 'online' | 'offline'): Promise<void> => {
    let existingUser = await User.findById(userId);
    if (existingUser) {
        existingUser.online = status === 'online';

        if (status === 'offline') {
            existingUser.lastSeen = new Date();
        }

        existingUser.markModified('lastSeen');
        existingUser.markModified('online');
        await existingUser.save();
    }
};

export default updateUserStatus;
