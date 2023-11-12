import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import User, { UserInterface } from '../../models/User.model';
import { UpdateUserValidate } from './user.validate';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';

export const getUser: RequestHandler = async (req: Request, res: Response<UserInterface | GeneralErrorResponse>, next: NextFunction) => {
    const { userId } = req.user as { userId: string };

    try {
        User.findById(userId)
            .select('-authInfo.confirmationCode')
            .select('-authInfo.confirmed')
            .select('-authInfo.password')
            .select('-resetPassword')
            .then((user) => (user ? res.status(200).json(user) : res.status(404).json({ error: 'user not found' })))
            .catch((error) => next(error));
    } catch (error) {
        next(error);
    }
};

export const updateUser: RequestHandler = async (
    req: Request<{}, GeneralErrorResponse | UserInterface, UpdateUserValidate>,
    res: Response<GeneralErrorResponse | { user: UserInterface }>,
    next: NextFunction
) => {
    try {
        const { userId } = req.user as { userId: string };
        const { file, body } = req;

        let updatedUserInfo = {};

        if (body && file) {
            UpdateUserValidate.parse({ ...body, avatar: file });
        } else {
            UpdateUserValidate.parse({ ...body });
        }

        if (file) {
            const storage = getStorage();
            const storageRef = ref(storage, 'avatars/' + file.originalname);
            await uploadBytes(storageRef, file.buffer);
            const downloadURL = await getDownloadURL(storageRef);

            updatedUserInfo = { ...body, avatar: downloadURL };
        } else {
            updatedUserInfo = { ...body };
        }

        const existingUser = await User.findById(userId).select('-authInfo.confirmationCode').select('-authInfo.confirmed').select('-authInfo.password').select('-resetPassword');

        if (existingUser) {
            existingUser.userInfo = { ...existingUser?.userInfo, ...updatedUserInfo };
            existingUser.markModified('userInfo');
            await existingUser.save();

            res.status(200).json({ user: existingUser });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};
