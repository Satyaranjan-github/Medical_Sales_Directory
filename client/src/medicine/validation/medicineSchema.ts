import { z } from 'zod'

export const medicineSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Name is Required"),
    cost: z.number({
        error: 'Cost is required',
    }),
    gst: z.number({
        error: 'GST is required',
    }),
    discount: z.number({
        error: 'Discount is required',
    }),
    brand: z.object({
        _id: z.string().min(1, "Brand is required"),
        name: z.string().min(1),
    }),
    category: z.object({
        _id: z.string().min(1, "Category is required"),
        name: z.string().min(1),
    }),
    expiry: z.date({
        error: "Expiry Date is required"
    }),
    description: z.string({
        error: 'Description is required',
    }).optional(),
    isDeleted: z.boolean().optional()
})