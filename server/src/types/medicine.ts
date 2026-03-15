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


// export interface IMedicine extends Document {
//     name: string;
//     brandName?: string;
//     genericName?: string;
//     manufacturer?: string;
//     category?: string;

//     batchNumber?: string;

//     purchasePrice: number;
//     sellingPrice: number;
//     mrp: number;

//     gst: number;
//     discount: number;

//     stock: number;
//     minStock?: number;
//     unit?: string;

//     manufactureDate?: Date;
//     expiry: Date;

//     barcode?: string;

//     supplier?: string;

//     description?: string;

//     requiresPrescription?: boolean;

//     isActive?: boolean;
//     isDeleted?: boolean;

//     createdAt: Date;
//     updatedAt: Date;
//     deletedAt?: Date;
// }