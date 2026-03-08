import { Document } from 'mongoose';

export interface IMedicine extends Document {
    name: string;
    cost: number;
    gst: number;
    discount: number;
    expiry: Date;
    description?: string;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}