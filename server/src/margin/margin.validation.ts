import { z } from 'zod';

export const marginSchema = z.object({
    title: z.string({
        error: 'Title is required',
    }),
    value: z.number({
        error: 'Value is required',
    }),
    description: z.string().optional(),
    isDeleted: z.boolean().optional(),
});
