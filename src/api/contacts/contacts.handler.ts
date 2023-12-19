import { NextFunction, Request, Response } from 'express';
import User from '../../models/User.model';

export const addContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, providerId } = req.body;
        const { userId } = req.user as { userId: string };

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        } else {
            let foundedContact: any;

            if (email) {
                foundedContact = await User.findOne({ 'authInfo.email': email });
            } else {
                foundedContact = await User.findOne({ 'authInfo.providerId': providerId });
            }

            if (!foundedContact) {
                return res.status(401).json({ error: 'Contact does not exist' });
            } else {
                if (foundedContact._id.toString() === existingUser._id.toString()) {
                    return res.status(409).json({ error: 'You are trying to add yourself as contact' });
                }

                const isContactAlreadyAdded = existingUser.contacts.some((contact) => {
                    return contact.user.toString() === foundedContact._id.toString();
                });

                if (isContactAlreadyAdded) {
                    return res.status(409).json({ error: 'Contact already added' });
                }

                const newContact = {
                    user: foundedContact._id,
                    isBlocked: false
                };

                existingUser.contacts.push(newContact);
                existingUser.markModified('contacts');
                existingUser.save();

                return res.status(200).json({ message: 'New Contact added successfully' });
            }
        }
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
        next(error);
    }
};
