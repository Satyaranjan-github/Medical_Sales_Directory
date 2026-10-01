import { Document, Schema } from "mongoose";
import type { IMedicine } from "./medicine";

export interface IStock extends Document {
    medicine: any;
    quantity: number;
    minStockLevel: number;
    maxStockLevel?: number | undefined;
    location?: string | undefined;
    status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
    notes?: string | undefined;
    isDeleted: boolean;
    deletedAt?: Date | null | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}
