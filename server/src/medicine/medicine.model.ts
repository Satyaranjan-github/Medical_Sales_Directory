import { model, Schema } from "mongoose";
import type { IMedicine } from "../types/medicine.ts";

const medicineSchema = new Schema<IMedicine>({
    name: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    batchNumber: { type: String },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    gst: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    manufactureDate: { type: Date },
    expiry: { type: Date, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

export const Medicine = model<IMedicine>("Medicine", medicineSchema);