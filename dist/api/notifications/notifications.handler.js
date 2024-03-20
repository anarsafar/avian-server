"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactNotification = exports.profileNotification = exports.getNotifications = exports.addNotification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const Notification_model_1 = __importDefault(require("../../models/Notification.model"));
const Conversation_model_1 = __importDefault(require("../../models/Conversation.model"));
const socket_1 = require("../../socket");
const addNotification = async (req, res, next) => {
    try {
        const { searchParam } = req.params;
        const { type, osInfo, location, browserInfo } = req.body;
        const existingUser = (await User_model_1.default.findOne({ 'authInfo.email': searchParam })) || (await User_model_1.default.findOne({ 'authInfo.providerId': searchParam }));
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        const newNotification = new Notification_model_1.default({
            userId: existingUser._id,
            type,
            osInfo,
            browserInfo,
            location
        });
        await newNotification.save();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        await Notification_model_1.default.deleteMany({ userId: existingUser._id, createdAt: { $lt: thirtyDaysAgo } });
        return res.status(201).json({ message: 'Notification added successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.addNotification = addNotification;
const getNotifications = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const existingUser = await User_model_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        const notifications = await Notification_model_1.default.find({ userId });
        if (!notifications) {
            return res.status(404).json({ error: 'Notifications not found' });
        }
        return res.status(200).json({ notifications });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
const profileNotification = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const existingUser = await User_model_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        existingUser.notification = !existingUser.notification;
        existingUser.save();
        return res.status(200).json({ user: existingUser });
    }
    catch (error) {
        next(error);
    }
};
exports.profileNotification = profileNotification;
const contactNotification = async (req, res, next) => {
    const io = (0, socket_1.getIO)();
    try {
        const { userId } = req.user;
        const { contactId } = req.params;
        const existingUser = await User_model_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        const contactObjectId = new mongoose_1.default.Types.ObjectId(contactId);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const existingContact = existingUser.contacts.find((contact) => contact.user.toString() === contactObjectId.toString());
        if (!existingContact) {
            return res.status(404).json({ error: 'contact not found' });
        }
        existingContact.notification = !existingContact.notification;
        const conversation = await Conversation_model_1.default.findOne({ participants: { $all: [userObjectId, contactObjectId] } });
        if (conversation) {
            const newConversations = existingUser.conversations.map((chat) => {
                if (String(chat.conversation) === String(conversation._id)) {
                    chat.muted = !existingContact.notification;
                }
                return chat;
            });
            existingUser.conversations = newConversations;
            existingUser.markModified('conversations');
        }
        const contacts = existingUser.contacts.filter((contact) => contact.user.toString() !== contactObjectId.toString());
        existingUser.contacts = [...contacts, existingContact];
        existingUser.save();
        if (conversation) {
            io.emit('update-conversations', userId, contactId);
        }
        return res.status(200).json({ user: existingUser });
    }
    catch (error) {
        next(error);
    }
};
exports.contactNotification = contactNotification;
//# sourceMappingURL=notifications.handler.js.map