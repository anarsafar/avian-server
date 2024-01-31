import { NextFunction, Request, Response } from 'express';
import User from '../../models/User.model';
import Conversation from '../../models/Conversation.model';

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user as { userId: string };

        const user = await User.findById(userId).populate([
            { path: 'conversations', populate: { path: 'participants', select: 'userInfo.name userInfo.avatar online lastSeen authInfo.email authInfo.providerId, userInfo.username' } }
        ]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ conversations: user.conversations });
    } catch (error) {
        next(error);
    }
};

export const deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findByIdAndDelete(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        return res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        next(error);
    }
};
