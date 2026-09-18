import { z } from "zod";

export const brandSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Brand name is required"),
    isActive: z.boolean().optional().default(true),
    description: z.string().optional(),
    isDeleted: z.boolean().optional(),
});

export type BrandFormData = z.infer<typeof brandSchema>;
