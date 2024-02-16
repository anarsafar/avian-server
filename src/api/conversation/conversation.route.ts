import express, { Router } from 'express';

import blacklisted from '../../middlewares/blacklist.middleware';
import authenticateToken from '../../middlewares/jwt.middleware';
import { deleteConversation, getConversations } from './conversation.handler';

const conversationRoute: Router = express.Router();

conversationRoute.get('/', blacklisted, authenticateToken, getConversations);
conversationRoute.delete('/:conversationId', blacklisted, authenticateToken, deleteConversation);

export default conversationRoute;
