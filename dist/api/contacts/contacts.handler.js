"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockOrDeleteContact = exports.getContacts = exports.addContact = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const addContact = async (req, res, next) => {
    try {
        const { contact } = req.body;
        const { userId } = req.user;
        const searchQuery = contact.includes('@') ? 'authInfo.email' : 'userInfo.username';
        const existingUser = await User_model_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        let foundedContact = await User_model_1.default.findOne({ [searchQuery]: contact });
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
            isBlocked: false,
            notification: true
        });
        existingUser.markModified('contacts');
        await existingUser.save();
        return res.status(200).json({ message: 'Contact added successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.addContact = addContact;
const getContacts = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = await User_model_1.default.findById(userId).populate({
            path: 'contacts.user',
            select: 'userInfo.name userInfo.avatar online lastSeen authInfo.email authInfo.providerId, userInfo.username'
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ contacts: user.contacts });
    }
    catch (error) {
        next(error);
    }
};
exports.getContacts = getContacts;
const blockOrDeleteContact = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { contactId } = req.params;
        const { action } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contactId' });
        }
        const existingUser = await User_model_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        const contactObjectId = new mongoose_1.default.Types.ObjectId(contactId);
        const contactIndex = existingUser.contacts.findIndex((c) => c.user.toString() === contactObjectId.toString());
        if (contactIndex === -1) {
            return res.status(404).json({ error: "Contact not found in user's contacts" });
        }
        if (action === 'block') {
            existingUser.contacts[contactIndex].isBlocked = !existingUser.contacts[contactIndex].isBlocked;
        }
        else if (action === 'delete') {
            existingUser.contacts.splice(contactIndex, 1);
        }
        existingUser.markModified('contacts');
        await existingUser.save();
        const responseText = action === 'block' ? (existingUser.contacts[contactIndex].isBlocked ? 'blocked' : 'unblocked') : 'deleted';
        return res.status(200).json({ message: `Contact ${responseText} successfully` });
    }
    catch (error) {
        next(error);
    }
};
exports.blockOrDeleteContact = blockOrDeleteContact;
//# sourceMappingURL=contacts.handler.js.map