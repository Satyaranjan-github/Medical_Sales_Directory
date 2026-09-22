import { model, Schema } from "mongoose";
import { PaymentMode, PaymentStatus, type ISale } from "../types/sale";

const saleMedicineSchema = new Schema({
    medicine: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
});

const saleSchema = new Schema<ISale>({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    saleDate: { type: Date, required: true, default: Date.now },
    medicines: [saleMedicineSchema],
    subTotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMode: { type: String, enum: Object.values(PaymentMode), required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), required: true },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

export const Sale = model<ISale>("Sale", saleSchema);