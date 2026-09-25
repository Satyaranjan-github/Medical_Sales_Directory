import type { Document } from "mongoose";

export interface IMargin extends Document {
    title: string;
    value: number;
    description?: string;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
