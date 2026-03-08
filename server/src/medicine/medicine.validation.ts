import { z } from 'zod'

export const medicineSchema = z.object({
    name: z.string({
        error: 'Name is required',
    }),
    cost: z.number({
        error: 'Cost is required',
    }),
    gst: z.number({
        error: 'GST is required',
    }),
    discount: z.number({
        error: 'Discount is required',
    }),
    expiry: z.string({
        error: 'Expiry date is required',
    }).transform((val) => new Date(val)),
    description: z.string({
        error: 'Description is required',
    }).optional(),
})