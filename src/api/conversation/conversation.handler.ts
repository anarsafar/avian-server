import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import User from '../../models/User.model';

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
        const { userId } = req.user as { userId: string };
        const { conversationId } = req.params;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (existingUser.conversations.indexOf(conversationId) === -1) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
        const conversationList = existingUser.conversations.filter((conversation) => conversation.toString() !== conversationObjectId.toString());

        existingUser.conversations = conversationList;
        existingUser.markModified('conversations');
        await existingUser.save();

        return res.status(204).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        next(error);
    }
};
