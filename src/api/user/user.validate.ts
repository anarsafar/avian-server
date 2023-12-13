import * as z from 'zod';

const emptyObjectSchema = z.object({}).strict();
const isEmpty = (obj: object): boolean => {
    const result = emptyObjectSchema.safeParse(obj);
    return result.success;
};

export const UpdateUserValidate = z
    .object({
        name: z.string().trim().min(1, { message: 'Name is required.' }).min(3, 'Name must be at least 3 characters long').optional(),
        bio: z.string().trim().min(1, { message: 'Bio is required.' }).min(3, 'Bio must be at least 3 characters long').optional(),
        phone: z
            .string()
            .trim()
            .min(1, { message: 'Phone is required' })
            .regex(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Invalid phone number')
            .default('')
            .optional(),
        avatar: z.unknown().optional(),
        darkMode: z.boolean().optional()
    })
    .refine((data) => !isEmpty(data), { message: 'Body can not be empty' });

export type UpdateUserValidate = z.infer<typeof UpdateUserValidate>;
