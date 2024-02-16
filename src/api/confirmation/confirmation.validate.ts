import * as z from 'zod';

export const ConfirmationBase = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required' })
        .email('Email is not a valid')
        .transform((email) => email.toLowerCase()),
    confirmationType: z.union([z.literal('email'), z.literal('password')])
});
export type ConfirmationBase = z.infer<typeof ConfirmationBase>;

export const ConfrimationValidate = ConfirmationBase.extend({
    confirmationCode: z.string().refine((code) => /^[a-zA-Z0-9]{6}$/.test(code))
});
export type ConfrimationValidate = z.infer<typeof ConfrimationValidate>;
