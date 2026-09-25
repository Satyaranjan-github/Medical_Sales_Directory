import { z } from 'zod';

export const marginSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    value: z
        .number({ message: "Value is required" })
        .min(0, "Value cannot be negative"),
    description: z.string().optional(),
    isDeleted: z.boolean().optional()
});

export type MarginFormData = z.infer<typeof marginSchema>;
