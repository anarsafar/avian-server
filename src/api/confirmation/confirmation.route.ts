import express, { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { ConfirmationBase, ConfrimationValidate } from './confirmation.validate';
import { confirmUser, getExpiration, sendVerification } from './confirmation.handler';

const router: Router = express.Router();

router.post('/', validateRequest({ body: ConfrimationValidate }), confirmUser);
router.post('/send-verification', validateRequest({ body: ConfirmationBase }), sendVerification);
router.post('/get-expiration', validateRequest({ body: ConfirmationBase }), getExpiration);

export default router;
