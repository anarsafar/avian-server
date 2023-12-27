import * as z from 'zod';

export const ValidateContact = z.object({
    contact: z
        .string()
        .trim()
        .min(1, { message: 'provide username or email' })
        .refine(
            (value) => {
                const isEmail = /\S+@\S+\.\S+/.test(value);
                const isUserName = typeof value === 'string' && value.trim().length > 0 && /^[a-z0-9_]+$/.test(value);

                if (value.includes('@')) {
                    return isEmail;
                }

                return isUserName;
            },
            {
                message: 'Please enter a valid email or username'
            }
        )
        .refine((contact) => contact.toLowerCase())
});

export type ValidateContactType = z.infer<typeof ValidateContact>;

export type ValidateContact = z.infer<typeof ValidateContact>;

export const ValidateAction = z.object({
    action: z.union([z.literal('block'), z.literal('delete')])
});

export type ValidateAction = z.infer<typeof ValidateAction>;
