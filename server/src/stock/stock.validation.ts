import { z } from "zod";

export const stockSchema = z.object({
    medicine: z.union([
        z.string({ message: "Medicine is required" }),
        z.object({
            _id: z.string(),
            name: z.string().optional()
        })
    ]),
    quantity: z.number().min(0, "Quantity cannot be negative").default(0),
    minStockLevel: z.number().min(0, "Minimum stock level cannot be negative").optional().default(10),
    maxStockLevel: z.number().min(0).optional().default(500),
    location: z.string().optional().default("Main Store"),
    notes: z.string().optional()
});
