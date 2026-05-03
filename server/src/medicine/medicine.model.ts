import { model, Schema } from "mongoose";
import type { IMedicine } from "../types/medicine.ts";

const medicineSchema = new Schema<IMedicine>({
    name: { type: String },
    cost: { type: Number },
    gst: { type: Number },
    discount: { type: Number },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    expiry: { type: Date },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

export const Medicine = model<IMedicine>("Medicine", medicineSchema);