import express, { Router } from 'express';

import { resetPassword } from './reset.handler';
import { validateRequest } from '../../middlewares';
import { PasswordValidate } from './reset.validate';

const resetPasswordRouter: Router = express.Router();

resetPasswordRouter.patch('/', validateRequest({ body: PasswordValidate }), resetPassword);

export default resetPasswordRouter;
