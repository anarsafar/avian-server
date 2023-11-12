import express, { Router } from 'express';

import { resetPassword, sendResetEmail } from './reset.handler';
import { validateRequest } from '../../middlewares';
import { EmailValidate } from './reset.validate';

const resetPasswordRouter: Router = express.Router();

resetPasswordRouter.post('/', validateRequest({ body: EmailValidate }), sendResetEmail);
resetPasswordRouter.patch('/', resetPassword);

export default resetPasswordRouter;
