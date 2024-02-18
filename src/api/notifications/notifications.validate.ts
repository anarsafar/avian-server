import * as z from 'zod';

export const ValidateNotifaction = z.object({
    type: z.union([z.literal('reset'), z.literal('login'), z.literal('group')]),
    osInfo: z.string().min(1, 'OS info required'),
    location: z
        .object({
            latitude: z.number().min(1, 'latitude is required'),
            longitude: z.number().min(1, 'ongitude is required')
        })
        .optional(),
    browserInfo: z.string()
});

export type ValidateNotifaction = z.infer<typeof ValidateNotifaction>;
