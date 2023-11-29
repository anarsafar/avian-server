import express, { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { ConfirmationBase, ConfrimationValidate } from './confirmation.validate';
import { confirmUser, getExpiration, resendEmail } from './confirmation.handler';

const router: Router = express.Router();

router.post('/', validateRequest({ body: ConfrimationValidate }), confirmUser);
router.post('/resend', validateRequest({ body: ConfirmationBase }), resendEmail);
router.post('/get-expiration', validateRequest({ body: ConfirmationBase }), getExpiration);

export default router;
