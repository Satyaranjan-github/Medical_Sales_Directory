import { model, Schema } from "mongoose";
import type { IBrand } from "../types/brand";

const brandSchema = new Schema<IBrand>({
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
},
    { timestamps: true }
)

export const Brand = model<IBrand>("Brand", brandSchema);