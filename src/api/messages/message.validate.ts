import * as z from 'zod';

export const ValidateMessage = z.object({
    senderId: z.string().trim().min(1, { message: 'provide sender id' }),
    chatId: z.string().trim().min(1, { message: 'provide conversation id' }),
    recipientId: z.string().trim().min(1, { message: 'recipient id' }),
    message: z.object({
        messageBody: z.string().trim().min(1, { message: 'include message' }),
        timeStamp: z.string()
    })
});

export type ValidateMessage = z.infer<typeof ValidateMessage>;
