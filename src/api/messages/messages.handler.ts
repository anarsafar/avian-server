import { NextFunction, Request, Response } from 'express';
import Message, { MessageI } from '../../models/Message.model';
import Conversation from '../../models/Conversation.model';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';
import User from '../../models/User.model';
import saveMessages from '../../socket/messages/saveMessages';

interface MessageResponse {
    messages: MessageI[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export const getMessages = async (req: Request<{ conversationId: string }, MessageResponse | GeneralErrorResponse>, res: Response<MessageResponse | GeneralErrorResponse>, next: NextFunction) => {
    try {
        const { page = 1, pageSize = 20 } = req.query;
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const totalItems = conversation.messages.length;
        const totalPages = Math.ceil(totalItems / Number(pageSize));

        const messages = await Message.find({ conversation: conversationId })
            .sort({ timestamp: -1 })
            .skip((Number(page) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .exec();

        if (!messages) {
            return res.status(404).json({ error: 'Messages not found' });
        }

        return res.json({
            messages,
            pagination: {
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages,
                totalItems
            }
        });
    } catch (error) {
        next(error);
    }
};

interface Message {
    sender: string;
    recipients: string[];
    content: string;
    timestamp: Date;
    conversation: string;
    isRead: boolean;
}

export const addMessage = async (req: Request<{}, Message | GeneralErrorResponse>, res: Response<Message | GeneralErrorResponse>, next: NextFunction) => {
    try {
        const { userId } = req.user as { userId: string };
        const { senderId, recipientId, message, chatId } = req.body;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const msg = await saveMessages(message, senderId, recipientId, chatId);

        if (msg) {
            return res.status(201).json(msg);
        }
    } catch (error) {
        next(error);
    }
};
