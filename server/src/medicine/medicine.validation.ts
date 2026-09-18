import { z } from 'zod';

export const medicineSchema = z.object({
    name: z.string({
        error: 'Name is required',
    }),
    purchasePrice: z.number({
        error: 'Purchase price is required',
    }),
    sellingPrice: z.number({
        error: 'Selling price is required',
    }),
    gst: z.number().min(0, "GST cannot be negative").optional().default(18),
    stock: z.number().optional().default(0),
    batchNumber: z.string().optional(),
    manufactureDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : undefined),
    brand: z
        .object({
            _id: z.string(),
            name: z.string(),
        })
        .refine((val) => val !== null, {
            message: "Brand is required",
        }),
    category: z
        .object({
            _id: z.string(),
            name: z.string(),
        })
        .refine((val) => val !== null, {
            message: "Category is required",
        }),
    expiry: z.string({
        error: 'Expiry date is required',
    }).transform((val) => new Date(val)),
    description: z.string({
        error: 'Description is required',
    }).optional(),
})