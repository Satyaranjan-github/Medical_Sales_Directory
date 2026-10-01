import type { IMedicine } from "./medicine";

export interface IStock {
    _id?: string;
    medicine: IMedicine | string;
    quantity: number;
    minStockLevel: number;
    maxStockLevel?: number;
    location?: string;
    status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
    notes?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
