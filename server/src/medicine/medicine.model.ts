import { model, Schema } from "mongoose";
import type { IMedicine } from "../types/medicine.ts";

const medicineSchema = new Schema<IMedicine>({
    name: { type: String },
    cost: { type: Number },
    gst: { type: Number },
    discount: { type: Number },
    expiry: { type: Date },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, { timestamps: true });

export const Medicine = model<IMedicine>("Medicine", medicineSchema);