import express, { Router } from 'express';

import { validateRequest } from '../../middlewares';
import blacklisted from '../../middlewares/blacklist.middleware';
import authenticateToken from '../../middlewares/jwt.middleware';

import { addContact, blockOrDeleteContact, getContacts } from './contacts.handler';
import { ValidateAction, ValidateContact } from './contacts.valitate';

const contactRoute: Router = express.Router();

contactRoute.get('/', blacklisted, authenticateToken, getContacts);
contactRoute.post('/', blacklisted, authenticateToken, validateRequest({ body: ValidateContact }), addContact);
contactRoute.post('/:contactId', blacklisted, authenticateToken, validateRequest({ body: ValidateAction }), blockOrDeleteContact);

export default contactRoute;
