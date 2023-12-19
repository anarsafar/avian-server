import express, { Router } from 'express';

import { validateRequest } from '../../middlewares';
import blacklisted from '../../middlewares/blacklist.middleware';
import authenticateToken from '../../middlewares/jwt.middleware';

import { addContact, deleteContact } from './contacts.handler';
import { ValidateContact } from './contacts.valitate';

const contactRoute: Router = express.Router();

// contactRoute.get('/', blacklisted, authenticateToken, validateRequest({ body: ContactValidate }), getContacts);
// contactRoute.get('/contactInfo', blacklisted, authenticateToken, validateRequest({ body: ContactValidate }), getContactInfo);
contactRoute.post('/', blacklisted, authenticateToken, validateRequest({ body: ValidateContact }), addContact);
contactRoute.delete('/', blacklisted, authenticateToken, validateRequest({ body: ValidateContact }), deleteContact);

export default contactRoute;
