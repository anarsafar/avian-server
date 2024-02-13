import { NextFunction, Request, Response } from 'express';
import Message, { MessageI } from '../../models/Message.model';
import Conversation from '../../models/Conversation.model';
import { GeneralErrorResponse } from '../../interfaces/ErrorResponses';

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
