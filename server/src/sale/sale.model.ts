import { Schema } from "mongoose";
import { PaymentMode, PaymentStatus, type ISale } from "../types/sale";

const saleMedicineSchema = new Schema({
    medicine: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
})

const saleSchema = new Schema<ISale>({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    saleDate: { type: Date, required: true },
    medicines: [saleMedicineSchema],
    subTotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMode: { type: String, enum: PaymentMode },
    paymentStatus: { type: String, enum: PaymentStatus },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
}, {
    timestamps: true
})

export const Sale = new Schema<ISale>("Sale", saleSchema);