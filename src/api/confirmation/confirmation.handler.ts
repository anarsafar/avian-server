import { NextFunction, Request, Response } from 'express';
import User from '../../models/User.model';
import { ConfirmationBase, ConfrimationValidate } from './confirmation.validate';
import MessageResponse from '../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import generateConfirmation from '../../utils/generateConfirmation';
import sendEmail, { EmailType } from '../../services/sendEmail.service';

export const confirmUser = async (req: Request<{}, MessageResponse | GeneralErrorResponse, ConfrimationValidate>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    const { confirmationCode, confirmationType, email } = req.body;

    const searchQuery = confirmationType === 'password' ? 'resetPassword' : 'authInfo';

    try {
        const existingUser = await User.findOne({ 'authInfo.email': email });

        if (existingUser) {
            const confirmed = existingUser[searchQuery].confirmed;

            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed` });
            } else {
                if (confirmationCode !== existingUser[searchQuery].confirmationCode) {
                    return res.status(400).json({ error: 'Please provide correct confirmation code' });
                } else {
                    const confirmationTimestamp = existingUser[searchQuery].confirmationTimestamp;
                    const currentTime = new Date();
                    const timeDifference = currentTime.getTime() - confirmationTimestamp.getTime();
                    if (timeDifference > 5 * 60 * 1000) {
                        return res.status(422).json({ error: 'Confirmation code has expired' });
                    } else {
                        existingUser[searchQuery].confirmed = true;
                        existingUser.markModified(`${searchQuery}.confirmed`);
                        await existingUser.save();
                        return res.status(200).json({ message: `Email confirmed successfully` });
                    }
                }
            }
        } else {
            res.status(422).json({ error: 'User does not exist' });
        }
    } catch (error) {
        next(error);
    }
};

export const sendVerification = async (req: Request<{}, MessageResponse | GeneralErrorResponse, ConfirmationBase>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    const { email, confirmationType } = req.body;
    const searchQuery = confirmationType === 'password' ? 'resetPassword' : 'authInfo';

    try {
        let existingUser = await User.findOne({ 'authInfo.email': email });

        if (existingUser) {
            const confirmed = existingUser[searchQuery]?.confirmed;

            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed.` });
            } else {
                existingUser[searchQuery].confirmationCode = generateConfirmation(6);
                existingUser[searchQuery].confirmationTimestamp = new Date();

                existingUser.markModified(searchQuery);
                await existingUser.save();

                await sendEmail(email, existingUser[searchQuery].confirmationCode, confirmationType === 'email' ? EmailType.signup : EmailType.reset);
                return res.status(200).json({ message: 'Check email inbox for new confirmation' });
            }
        } else {
            res.status(422).json({ error: 'User does not exist' });
        }
    } catch (error) {
        next(error);
    }
};

export const getExpiration = async (
    req: Request<{}, { confirmationTimestamp: string } | GeneralErrorResponse, ConfirmationBase>,
    res: Response<{ confirmationTimestamp: string } | GeneralErrorResponse>,
    next: NextFunction
) => {
    const { email, confirmationType } = req.body;
    const searchQuery = confirmationType === 'password' ? 'resetPassword' : 'authInfo';

    try {
        let existingUser = await User.findOne({ 'authInfo.email': email });

        if (existingUser) {
            const confirmed = existingUser[searchQuery].confirmed;

            if (confirmed) {
                return res.status(409).json({ error: `Email already confirmed.` });
            } else {
                return res.status(200).json({ confirmationTimestamp: existingUser[searchQuery].confirmationTimestamp });
            }
        } else {
            res.status(422).json({ error: 'User does not exists' });
        }
    } catch (error) {
        next(error);
    }
};
