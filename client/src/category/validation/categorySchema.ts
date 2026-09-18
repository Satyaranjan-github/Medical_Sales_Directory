import { z } from "zod";

export const categorySchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Category name is required"),
    isActive: z.boolean().optional().default(true),
    description: z.string().optional(),
    isDeleted: z.boolean().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
