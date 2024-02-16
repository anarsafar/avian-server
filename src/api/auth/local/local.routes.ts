import express, { Router } from 'express';
import * as localAuthHandler from './local.handlers';
import { validateRequest } from '../../../middlewares';
import loginLimiter from '../../../middlewares/limiter.middleware';
import { LoginValidate, SignupValidate } from './local.validate';
import blacklisted from '../../../middlewares/blacklist.middleware';

const localAuthRouter: Router = express.Router();

localAuthRouter.post('/signup', validateRequest({ body: SignupValidate }), localAuthHandler.signUp);
localAuthRouter.post('/login', loginLimiter, validateRequest({ body: LoginValidate }), localAuthHandler.logIn);
localAuthRouter.post('/logout', blacklisted, localAuthHandler.logOut);
localAuthRouter.post('/delivered', localAuthHandler.delivered);

export default localAuthRouter;
