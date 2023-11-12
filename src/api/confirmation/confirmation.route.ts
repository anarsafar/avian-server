import express, { Router } from 'express';
import confirmUser from './confirmation.handler';
import { validateRequest } from '../../middlewares';
import { ConfrimationValidate } from './confirmation.validate';

const router: Router = express.Router();

router.post('/', validateRequest({ body: ConfrimationValidate }), confirmUser);

export default router;
