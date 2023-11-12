import rateLimit from 'express-rate-limit';
import { NextFunction, Response, Request } from 'express';

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        error: 'Too many login attempts from this IP, please tyr again after 1 minute pause'
    },
    handler: (req: Request, res: Response, next: NextFunction, options) => {
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false
});

export default loginLimiter;
