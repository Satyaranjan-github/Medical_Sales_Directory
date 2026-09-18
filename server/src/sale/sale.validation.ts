import z from "zod";

export const saleSchema = z.object({
    customerName: z.string({
        error: 'Name is required',
    }),
    customerPhone: z.string({
        error: 'Phone Number is required',
    }),
    saleDate: z.date({
        error: "Sale Date is required",
    }),
    subTotal: z.number({ error: "Subtotal is required" }),
    discount: z.number({ error: "Discount is required" }),
    totalAmount: z.number({ error: "Total Amount is required" }),
})