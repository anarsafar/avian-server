import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import User, { UserInterface } from '../../models/User.model';
import MessageResponse from '../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import { ValidateNotifaction } from './notifications.validate';
import Notification, { NotificationI } from '../../models/Notification.model';
import Conversation from '../../models/Conversation.model';
import { getIO } from '../../socket';

export const addNotification = async (
    req: Request<{ searchParam: string }, MessageResponse | GeneralErrorResponse, ValidateNotifaction>,
    res: Response<MessageResponse | GeneralErrorResponse>,
    next: NextFunction
) => {
    try {
        const { searchParam } = req.params;

        const { type, osInfo, location, browserInfo } = req.body;

        const existingUser = (await User.findOne({ 'authInfo.email': searchParam })) || (await User.findOne({ 'authInfo.providerId': searchParam }));

        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        const newNotification = new Notification({
            userId: existingUser._id,
            type,
            osInfo,
            browserInfo,
            location
        });

        await newNotification.save();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await Notification.deleteMany({ userId: existingUser._id, createdAt: { $lt: thirtyDaysAgo } });

        return res.status(201).json({ message: 'Notification added successfully' });
    } catch (error) {
        next(error);
    }
};

export const getNotifications = async (req: Request<{}, MessageResponse | GeneralErrorResponse>, res: Response<GeneralErrorResponse | { notifications: NotificationI[] }>, next: NextFunction) => {
    try {
        const { userId } = req.user as { userId: string };

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        const notifications = await Notification.find({ userId });

        if (!notifications) {
            return res.status(404).json({ error: 'Notifications not found' });
        }

        return res.status(200).json({ notifications });
    } catch (error) {
        next(error);
    }
};

export const profileNotification = async (req: Request<{}, { user: UserInterface } | GeneralErrorResponse>, res: Response<GeneralErrorResponse | { user: UserInterface }>, next: NextFunction) => {
    try {
        const { userId } = req.user as { userId: string };

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        existingUser.notification = !existingUser.notification;
        existingUser.save();

        return res.status(200).json({ user: existingUser });
    } catch (error) {
        next(error);
    }
};

export const contactNotification = async (
    req: Request<{ contactId: string }, { user: UserInterface } | GeneralErrorResponse>,
    res: Response<GeneralErrorResponse | { user: UserInterface }>,
    next: NextFunction
) => {
    const io = getIO();

    try {
        const { userId } = req.user as { userId: string };
        const { contactId } = req.params;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        const contactObjectId = new mongoose.Types.ObjectId(contactId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const existingContact = existingUser.contacts.find((contact) => contact.user.toString() === contactObjectId.toString());

        if (!existingContact) {
            return res.status(404).json({ error: 'contact not found' });
        }

        existingContact.notification = !existingContact.notification;

        const conversation = await Conversation.findOne({ participants: { $all: [userObjectId, contactObjectId] } });

        if (conversation) {
            const newConversations = existingUser.conversations.map((chat) => {
                if (String(chat.conversation) === String(conversation._id)) {
                    chat.muted = !existingContact.notification;
                }
                return chat;
            });
            existingUser.conversations = newConversations;
            existingUser.markModified('conversations');
        }

        const contacts = existingUser.contacts.filter((contact) => contact.user.toString() !== contactObjectId.toString());
        existingUser.contacts = [...contacts, existingContact];
        existingUser.save();

        if (conversation) {
            io.emit('update-conversations', userId, contactId);
        }

        return res.status(200).json({ user: existingUser });
    } catch (error) {
        next(error);
    }
};
