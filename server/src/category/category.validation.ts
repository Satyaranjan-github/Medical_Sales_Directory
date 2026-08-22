import z from "zod";

export const categorySchema = z.object({
    name: z.string({
        error: 'Name is required',
    }),
    description: z.string({
        error: 'Description is required',
    }).optional(),
})
