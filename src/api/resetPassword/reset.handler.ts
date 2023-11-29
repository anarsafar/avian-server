import { NextFunction, Request, Response } from 'express';

import resetPasswordService from '../../services/reset.service';

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword, email } = req.body;

    try {
        const result = await resetPasswordService(password, confirmPassword, email);
        res.status(result.error ? 400 : 200).json(result);
    } catch (error) {
        next(error);
    }
};
