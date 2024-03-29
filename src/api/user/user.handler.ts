import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import User, { UserInterface } from '../../models/User.model';
import { UpdateUserValidate } from './user.validate';
import MessageResponse from '../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import isPassphraseUnique from '../../utils/isPassphraseUnique';
import { getIO } from '../../socket';

export const getUser: RequestHandler = async (req: Request, res: Response<UserInterface | GeneralErrorResponse>, next: NextFunction) => {
    const { userId } = req.user as { userId: string };

    try {
        const user = await User.findById(userId)
            .select('-authInfo.confirmationCode')
            .select('-authInfo.confirmed')
            .select('-authInfo.password')
            .select('-authInfo.confirmationTimestamp')
            .select('-resetPassword');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'user not found' });
        }
    } catch (err) {
        next(err);
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
        const { theme, username, ...updateData } = body;

        let updatedUserInfo = {};

        if (username && !(await isPassphraseUnique(username, userId))) {
            return res.status(409).json({ error: 'username already taken' });
        }

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
            updatedUserInfo = { ...updateData, avatar: downloadURL, username };
        } else if (username) {
            updatedUserInfo = { ...updateData, username };
        } else {
            updatedUserInfo = { ...updateData };
        }

        const existingUser = await User.findById(userId)
            .select('-authInfo.confirmationCode')
            .select('-authInfo.confirmed')
            .select('-authInfo.password')
            .select('-authInfo.confirmationTimestamp')
            .select('-resetPassword');

        if (existingUser) {
            if (theme !== undefined) {
                existingUser.preferences.theme = theme;
                existingUser.markModified('preferences');
            }

            existingUser.userInfo = { ...existingUser?.userInfo, ...updatedUserInfo };
            existingUser.markModified('userInfo');
            await existingUser.save();

            const io = getIO();
            io.emit('refreshData', existingUser._id);

            res.status(200).json({ user: existingUser });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    const { userId } = req.user as { userId: string };

    try {
        const user = await User.findByIdAndDelete(userId);

        if (user) {
            res.status(200).json({ message: 'Account Deleted Successfully' });
        } else {
            res.status(404).json({ error: 'user not found' });
        }
    } catch (err) {
        next(err);
    }
};

export const deleteAvatar: RequestHandler = async (req: Request, res: Response<{ user: UserInterface } | GeneralErrorResponse>, next: NextFunction) => {
    const { userId } = req.user as { userId: string };

    try {
        const user = await User.findById(userId);

        if (user) {
            user.userInfo.avatar = '';
            user.markModified('userInfo');
            await user.save();
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: 'user not found' });
        }
    } catch (err) {
        next(err);
    }
};
