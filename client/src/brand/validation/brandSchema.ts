import z from "zod";

export const brandSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Name is Required"),
    description: z.string({
        error: 'Description is required',
    }).optional(),
})
