import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import passport from 'passport';
import { initializeApp } from 'firebase/app';

import { config } from './config/keys';
import MessageResponse from './interfaces/MessageResponse';
import * as middlewares from './middlewares';
import api from './api';
import strategies from './api/auth/social/social.strategies';

const app = express();
const corsOptions = {
    origin: config.applicationURLs.frontendURL,
    credentials: true
};

initializeApp(config.firebaseConfig);

passport.use(strategies.googleStrategy);
passport.use(strategies.facebookStrategy);
passport.use(strategies.githubStrategy);

app.use(passport.initialize());

app.use(morgan('dev'));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('templates', path.join(__dirname, 'templates'));

app.get<{}, MessageResponse>('/', (req, res) => {
    res.json({
        message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
    });
});

app.use('/api/v1', api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
