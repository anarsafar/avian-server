import express, { Router } from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import localAuthRouter from './auth/local/local.routes';
import confrimationRoute from './confirmation/confirmation.route';
import refreshRouter from './refresh/refresh.route';
import resetPasswordRouter from './resetPassword/reset.route';
import userRoute from './user/user.route';
import socialRoute from './auth/social/social.route';
import contactRoute from './contacts/contacts.route';
import conversationRoute from './conversation/conversation.route';
import messagesRoute from './messages/messages.route';
import notificationRoute from './notifications/notifications.route';

const router: Router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});

router.use('/auth', localAuthRouter);
router.use('/auth', socialRoute);
router.use('/confirmation', confrimationRoute);
router.use('/refresh', refreshRouter);
router.use('/reset-password', resetPasswordRouter);
router.use('/user', userRoute);
router.use('/contacts', contactRoute);
router.use('/conversations', conversationRoute);
router.use('/messages', messagesRoute);
router.use('/notifications', notificationRoute);

export default router;
