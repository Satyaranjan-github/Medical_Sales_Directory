import { Document, Types } from 'mongoose';
import type { IMargin } from './margin.ts';

export interface IMedicine extends Document {
    name: string;

    brand: Types.ObjectId | string;
    category: Types.ObjectId | string;
    margin?: Types.ObjectId | string | IMargin;

    batchNumber?: string;

    purchasePrice: number;
    sellingPrice: number;

    gst: number;

    stock?: number;

    manufactureDate?: Date;
    expiry: Date;

    description?: string;

    isDeleted?: boolean;

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}