import express, { Router } from 'express';

import blacklisted from '../../middlewares/blacklist.middleware';
import authenticateToken from '../../middlewares/jwt.middleware';
import { getMessages } from './messages.handler';

const messagesRoute: Router = express.Router();

messagesRoute.get('/:conversationId', blacklisted, authenticateToken, getMessages);

export default messagesRoute;
