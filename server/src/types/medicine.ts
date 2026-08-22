import { Document, Types } from 'mongoose';

export interface IMedicine extends Document {
    name: string;

    brand: Types.ObjectId | string;
    category: Types.ObjectId | string;

    batchNumber?: string;

    purchasePrice: number;
    sellingPrice: number;

    gst: number;

    stock?: number;

    manufactureDate?: Date;
    expiry: Date;

    // supplier?: string;

    description?: string;

    isDeleted?: boolean;

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}