import * as z from 'zod';

export const ConfrimationValidate = z.object({
    confirmationCode: z.string().refine((code) => /^[a-zA-Z0-9]{6}$/.test(code)),
    confirmationType: z.union([z.literal('email'), z.literal('password')])
});

export type ConfrimationValidate = z.infer<typeof ConfrimationValidate>;
