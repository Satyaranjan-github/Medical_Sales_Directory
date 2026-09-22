import z from "zod";
import { PaymentMode, PaymentStatus } from "../../types/sale";

export const saleMedicineInputSchema = z.object({
    medicine: z.string({ message: "Medicine ID is required" }),
    quantity: z.number({ message: "Quantity is required" }).min(1, "Quantity must be at least 1"),
    unitPrice: z.number({ message: "Unit price is required" }).min(0, "Unit price cannot be negative"),
    totalPrice: z.number({ message: "Total price is required" }).min(0, "Total price cannot be negative"),
});

export const createSaleSchema = z.object({
    customerName: z.string({ message: "Customer Name is required" }).min(1, "Customer name cannot be empty"),
    customerPhone: z.string().optional().default(""),
    saleDate: z.coerce.date().optional().default(() => new Date()),
    medicines: z.array(saleMedicineInputSchema).min(1, "At least one medicine item must be added to sale"),
    subTotal: z.number({ message: "Subtotal is required" }),
    discount: z.number().optional().default(0),
    totalAmount: z.number({ message: "Total Amount is required" }),
    paymentMode: z.nativeEnum(PaymentMode).optional().default(PaymentMode.UPI),
    paymentStatus: z.nativeEnum(PaymentStatus).optional().default(PaymentStatus.PAID),
    notes: z.string().optional(),
});

export const updateSaleSchema = createSaleSchema.partial();

export const saleSchema = createSaleSchema;