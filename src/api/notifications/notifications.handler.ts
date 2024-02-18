import { NextFunction, Request, Response } from 'express';

import User from '../../models/User.model';
import MessageResponse from '../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import { ValidateNotifaction } from './notifications.validate';
import Notification, { NotificationI } from '../../models/Notification.model';

export const addNotification = async (
    req: Request<{ email: string }, MessageResponse | GeneralErrorResponse, ValidateNotifaction>,
    res: Response<MessageResponse | GeneralErrorResponse>,
    next: NextFunction
) => {
    try {
        const { email } = req.params;

        const { type, osInfo, location, browserInfo } = req.body;

        const existingUser = await User.findOne({ 'authInfo.email': email });

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
