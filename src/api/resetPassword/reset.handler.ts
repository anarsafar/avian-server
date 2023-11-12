import { NextFunction, Request, Response } from 'express';

import User from '../../models/User.model';
import generateConfirmation from '../../utils/generateConfirmation';
import sendEmail, { EmailType } from '../../services/sendEmail.service';
import { EmailValidate } from './reset.validate';
import resetPasswordService from '../../services/reset.service';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import MessageResponse from '../../interfaces/MessageResponse';

export const sendResetEmail = async (req: Request<{}, GeneralErrorResponse | MessageResponse, EmailValidate>, res: Response<GeneralErrorResponse | MessageResponse>, next: NextFunction) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ 'authInfo.email': email });

        if (existingUser) {
            existingUser.resetPassword = {
                confirmationCode: generateConfirmation(6),
                confirmed: false,
                confirmationTimestamp: new Date()
            };

            existingUser.markModified(`resetPassword`);
            await existingUser.save();

            await sendEmail(email, existingUser.resetPassword.confirmationCode, EmailType.reset);

            return res.status(200).json({ message: 'check email for confirmation code' });
        } else {
            return res.status(404).json({ error: 'User does not exist' });
        }
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword, email } = req.body;

    try {
        const result = await resetPasswordService(password, confirmPassword, email);
        res.status(result.error ? 400 : 200).json(result);
    } catch (error) {
        next(error);
    }
};
