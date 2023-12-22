import * as z from 'zod';

export const ValidateContact = z.object({
    contact: z
        .string()
        .refine(
            (value) => {
                const isEmail = /\S+@\S+\.\S+/.test(value);
                const isNonEmptyString = typeof value === 'string' && value.trim().length > 0;

                return isEmail || isNonEmptyString;
            },
            {
                message: 'Contact must be either a valid email or a valid provider id'
            }
        )
        .refine((contact) => contact.toLowerCase())
});

export type ValidateContact = z.infer<typeof ValidateContact>;

export const ValidateAction = z.object({
    action: z.union([z.literal('block'), z.literal('delete')])
});

export type ValidateAction = z.infer<typeof ValidateAction>;
