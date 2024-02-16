import express, { Router } from 'express';
import refreshTokenHandler from './refresh.handler';

const refreshRouter: Router = express.Router();

refreshRouter.post('/', refreshTokenHandler);

export default refreshRouter;
