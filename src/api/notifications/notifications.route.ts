import express, { Router } from 'express';

import blacklisted from '../../middlewares/blacklist.middleware';
import authenticateToken from '../../middlewares/jwt.middleware';
import { addNotification, getNotifications } from './notifications.handler';
import { ValidateNotifaction } from './notifications.validate';
import { validateRequest } from '../../middlewares';

const notificationRoute: Router = express.Router();

notificationRoute.get('/', blacklisted, authenticateToken, getNotifications);
notificationRoute.post('/:email', validateRequest({ body: ValidateNotifaction }), addNotification);

export default notificationRoute;
