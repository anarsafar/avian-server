import * as z from 'zod';

export const EmailValidate = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required.' })
        .email('Email is not a valid.')
        .transform((email) => email.toLowerCase())
});

export type EmailValidate = z.infer<typeof EmailValidate>;

export const PasswordValidate = EmailValidate.extend({
    password: z
        .string()
        .trim()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .refine(
            (password) => {
                const hasUppercase = /[A-Z]/.test(password);
                const hasLowercase = /[a-z]/.test(password);
                const hasDigit = /\d/.test(password);
                const hasSpecialChar = /[!@#$%^&*()]/.test(password);

                if (!hasUppercase) {
                    throw new Error('Password must contain at least one uppercase letter');
                }
                if (!hasLowercase) {
                    throw new Error('Password must contain at least one lowercase letter');
                }
                if (!hasDigit) {
                    throw new Error('Password must contain at least one number');
                }
                if (!hasSpecialChar) {
                    throw new Error('Password must contain at least one special character');
                }

                return true;
            },
            {
                message: 'Password does not meet the required criteria'
            }
        ),
    confirmPassword: z.string().trim().min(8, { message: 'Password must be at least 8 characters long' })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});

export type PasswordValidate = z.infer<typeof PasswordValidate>;
