import express, { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { ConfrimationValidate } from './confirmation.validate';
import { confirmUser, getExpiration, resendEmail } from './confirmation.handler';
import { EmailValidate } from '../resetPassword/reset.validate';

const router: Router = express.Router();

router.post('/', validateRequest({ body: ConfrimationValidate }), confirmUser);
router.post('/resend', validateRequest({ body: EmailValidate }), resendEmail);
router.post('/expiration', validateRequest({ body: EmailValidate }), getExpiration);

export default router;
