import { model, Schema } from "mongoose";
import type { ICategory } from "../types/category";

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
},
    { timestamps: true }
)

export const Category = model<ICategory>("Category", categorySchema);