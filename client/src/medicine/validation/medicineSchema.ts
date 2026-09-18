import { z } from 'zod';

export const medicineSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Medicine name is required"),
    gst: z.preprocess(
        (val) => (val === "" || val === undefined || val === null || Number.isNaN(val) ? undefined : Number(val)),
        z.union([z.literal(5), z.literal(12), z.literal(18), z.literal(28)]).optional()
    ),
    stock: z
        .preprocess(
            (val) => (val === "" || val === undefined || val === null || Number.isNaN(val) ? 0 : Number(val)),
            z.number().min(0, "Stock cannot be negative")
        )
        .default(0),
    batchNumber: z.string().optional(),
    manufactureDate: z.date().optional(),
    brand: z.object({
        _id: z.string().min(1, "Brand is required"),
        name: z.string().min(1, "Brand name is required"),
    }),
    category: z.object({
        _id: z.string().min(1, "Category is required"),
        name: z.string().min(1, "Category name is required"),
    }),
    purchasePrice: z
        .number({ message: "Purchase price is required" })
        .min(0, "Purchase price must be positive"),

    sellingPrice: z
        .number({ message: "Selling price is required" })
        .min(0, "Selling price must be positive"),

    expiry: z
        .date({ message: "Expiry date is required" })
        .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
            message: "Valid expiry date is required",
        }),
    description: z.string().optional(),
    isDeleted: z.boolean().optional()
});

export type MedicineFormData = z.infer<typeof medicineSchema>;