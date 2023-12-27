import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import User, { ContactSchema, UserInterface } from '../../models/User.model';
import MessageResponse from '../../interfaces/MessageResponse';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import { ValidateContact } from './contacts.valitate';

export const addContact = async (req: Request<{}, MessageResponse | GeneralErrorResponse, ValidateContact>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    try {
        const { contact } = req.body;
        const { userId } = req.user as { userId: string };
        const searchQuery = contact.includes('@') ? 'authInfo.email' : 'userInfo.username';
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        let foundedContact: UserInterface | null = await User.findOne({ [searchQuery]: contact });

        if (!foundedContact || foundedContact === null) {
            return res.status(401).json({ error: 'Contact does not exist' });
        }

        if (foundedContact._id.toString() === existingUser._id.toString()) {
            return res.status(409).json({ error: 'You are trying to add yourself as contact' });
        }

        if (existingUser.contacts.some((contactRef) => contactRef.user.toString() === foundedContact?._id.toString())) {
            return res.status(400).json({ error: "Contact already exists in the user's contacts" });
        }

        existingUser.contacts.push({
            user: foundedContact._id,
            isBlocked: false
        });

        existingUser.markModified('contacts');
        await existingUser.save();

        return res.status(200).json({ message: 'Contact added successfully' });
    } catch (error) {
        next(error);
    }
};

export const getContacts = async (req: Request, res: Response<GeneralErrorResponse | { contacts: ContactSchema[] }>, next: NextFunction) => {
    try {
        const { userId } = req.user as { userId: string };

        const user = await User.findById(userId).populate({
            path: 'contacts.user',
            select: 'userInfo.name userInfo.avatar online lastSeen authInfo.email authInfo.providerId, userInfo.username'
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ contacts: user.contacts });
    } catch (error) {
        next(error);
    }
};

export const blockOrDeleteContact = async (req: Request, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    try {
        const { userId } = req.user as { userId: string };
        const { contactId } = req.params;
        const { action } = req.body;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contactId' });
        }

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        const contactObjectId = new mongoose.Types.ObjectId(contactId);
        const contactIndex = existingUser.contacts.findIndex((c) => c.user.toString() === contactObjectId.toString());

        if (contactIndex === -1) {
            return res.status(404).json({ error: "Contact not found in user's contacts" });
        }

        if (action === 'block') {
            existingUser.contacts[contactIndex].isBlocked = !existingUser.contacts[contactIndex].isBlocked;
        } else if (action === 'delete') {
            existingUser.contacts.splice(contactIndex, 1);
        }

        existingUser.markModified('contacts');
        await existingUser.save();

        const responseText = action === 'block' ? (existingUser.contacts[contactIndex].isBlocked ? 'blocked' : 'unblocked') : 'deleted';
        return res.status(200).json({ message: `Contact ${responseText} successfully` });
    } catch (error) {
        next(error);
    }
};
