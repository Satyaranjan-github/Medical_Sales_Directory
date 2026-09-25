import { model, Schema } from "mongoose";
import type { IMargin } from "../types/margin.ts";

const marginSchema = new Schema<IMargin>({
    title: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

export const Margin = model<IMargin>("Margin", marginSchema);
