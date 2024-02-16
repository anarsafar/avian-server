import express, { NextFunction, Router } from 'express';
import passport from 'passport';
import { callbackHelper } from './social.helper';
import { UserInterface } from '../../../models/User.model';

const socialRoute: Router = express.Router();

socialRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
socialRoute.get('/google/callback', (req: Request | any, res: Response | any, next: NextFunction) => {
    passport.authenticate('google', async (err: Error, user: UserInterface) => {
        callbackHelper(user, err, res, next);
    })(req, res);
});

socialRoute.get('/facebook', passport.authenticate('facebook'));
socialRoute.get('/facebook/callback', (req: Request | any, res: Response | any, next: NextFunction) => {
    passport.authenticate('facebook', async (err: Error, user: UserInterface) => {
        callbackHelper(user, err, res, next);
    })(req, res);
});

socialRoute.get('/github', passport.authenticate('github', { session: false, scope: ['user:email'] }));
socialRoute.get('/github/callback', (req: Request | any, res: Response | any, next: NextFunction) => {
    passport.authenticate('github', async (err: Error, user: UserInterface) => {
        callbackHelper(user, err, res, next);
    })(req, res);
});

export default socialRoute;
