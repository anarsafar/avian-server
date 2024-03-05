import express, { Router } from 'express';

import blacklisted from '../../middlewares/blacklist.middleware';
import authenticateToken from '../../middlewares/jwt.middleware';
import { getMessages, addMessage } from './messages.handler';
import { validateRequest } from '../../middlewares';
import { ValidateMessage } from './message.validate';

const messagesRoute: Router = express.Router();

messagesRoute.get('/:conversationId', blacklisted, authenticateToken, getMessages);
messagesRoute.post('/', blacklisted, authenticateToken, validateRequest({ body: ValidateMessage }), addMessage);

export default messagesRoute;
