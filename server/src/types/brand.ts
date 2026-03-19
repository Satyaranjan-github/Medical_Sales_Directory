import type { Document } from "mongoose";

export interface IBrand extends Document {
    name: string;
    description?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}