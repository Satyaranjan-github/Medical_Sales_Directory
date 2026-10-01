import { model, Schema } from "mongoose";
import type { IStock } from "../types/stock";

const stockSchema = new Schema<IStock>({
    medicine: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    quantity: { type: Number, required: true, default: 0 },
    minStockLevel: { type: Number, default: 10 },
    maxStockLevel: { type: Number, default: 500 },
    location: { type: String, default: "Main Store" },
    status: {
        type: String,
        enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
        default: "IN_STOCK"
    },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true });

export const Stock = model<IStock>("Stock", stockSchema);
