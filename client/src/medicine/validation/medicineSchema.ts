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
    expiry: z.date({
        error: "Expiry Date is required"
    }),
    description: z.string({
        error: 'Description is required',
    }).optional(),
    isDeleted: z.boolean().optional()
})