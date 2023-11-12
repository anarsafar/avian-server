import { NextFunction, Request, Response } from 'express';
import User from '../../models/User.model';
import { ConfrimationValidate } from './confirmation.validate';
import MessageResponse from '../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';

const confirmUser = async (req: Request<{}, MessageResponse | GeneralErrorResponse, ConfrimationValidate>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
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

export default confirmUser;
