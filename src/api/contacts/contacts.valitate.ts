import * as z from 'zod';

export const ValidateContact = z
    .object({
        email: z
            .string()
            .trim()
            .min(1, { message: 'Email is required' })
            .email('Email is not a valid')
            .transform((email) => email.toLowerCase())
            .optional(),

        providerId: z
            .string()
            .trim()
            .min(1, { message: 'ProviderId is required' })
            .transform((id) => id.toLowerCase())
            .optional()
    })
    .refine((data) => (data.email !== undefined) !== (data.providerId !== undefined), {
        message: 'Either email or providerId should be provided, but not both'
    });

export type ValidateContact = z.infer<typeof ValidateContact>;

export const ValidateAction = z.object({
    action: z.union([z.literal('block'), z.literal('delete')])
});

export type ValidateAction = z.infer<typeof ValidateAction>;
