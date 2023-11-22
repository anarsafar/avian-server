import { NextFunction, Request, Response } from 'express';
import User from '../../models/User.model';
import { ConfrimationValidate } from './confirmation.validate';
import MessageResponse from '../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import { EmailValidate } from '../resetPassword/reset.validate';
import generateConfirmation from '../../utils/generateConfirmation';
import sendEmail, { EmailType } from '../../services/sendEmail.service';

export const confirmUser = async (req: Request<{}, MessageResponse | GeneralErrorResponse, ConfrimationValidate>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    const { confirmationCode, confirmationType } = req.body;

    const searchQuery = confirmationType === 'password' ? 'resetPassword' : 'authInfo';
    const message = confirmationType === 'password' ? 'Reset password' : 'Email';

    try {
        const existingUser = await User.findOne({ [`${searchQuery}.confirmationCode`]: confirmationCode });

        if (existingUser) {
            const confirmed = existingUser[searchQuery].confirmed;

            if (confirmed) {
                return res.status(409).json({ error: `${message} already confirmed.` });
            } else {
                const confirmationTimestamp = existingUser[searchQuery].confirmationTimestamp;
                const currentTime = new Date();
                const timeDifference = currentTime.getTime() - confirmationTimestamp.getTime();

                if (timeDifference > 5 * 60 * 1000) {
                    return res.status(422).json({ error: 'Confirmation code has expired.' });
                }

                existingUser[searchQuery].confirmed = true;
                existingUser.markModified(`${searchQuery}.confirmed`);
                await existingUser.save();

                return res.status(200).json({ message: `${message} confirmed successfully.` });
            }
        } else {
            res.status(422).json({ error: 'Please provide correct confirmation code' });
        }
    } catch (error) {
        next(error);
    }
};

export const resendEmail = async (req: Request<{}, MessageResponse | GeneralErrorResponse, EmailValidate>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    const { email } = req.body;

    try {
        let existingUser = await User.findOne({ 'authInfo.email': email });

        if (existingUser) {
            const confirmed = existingUser.authInfo.confirmed;

            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed.` });
            } else {
                existingUser.authInfo.confirmationCode = generateConfirmation(6);
                existingUser.authInfo.confirmationTimestamp = new Date();

                existingUser.markModified('authInfo');
                await existingUser.save();

                await sendEmail(email, existingUser.authInfo.confirmationCode, EmailType.signup);
                return res.status(200).json({ message: 'Check email inbox for new confirmation' });
            }
        } else {
            res.status(422).json({ error: 'Please provide correct confirmation code' });
        }
    } catch (error) {
        next(error);
    }
};

export const getExpiration = async (
    req: Request<{}, { expiration: string } | GeneralErrorResponse, EmailValidate>,
    res: Response<{ expiration: string } | GeneralErrorResponse>,
    next: NextFunction
) => {
    const { email } = req.body;

    try {
        let existingUser = await User.findOne({ 'authInfo.email': email });

        if (existingUser) {
            const confirmed = existingUser.authInfo.confirmed;

            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed.` });
            } else {
                return res.status(200).json({ expiration: existingUser.authInfo.confirmationTimestamp });
            }
        } else {
            res.status(422).json({ error: 'User does not exists' });
        }
    } catch (error) {
        next(error);
    }
};
