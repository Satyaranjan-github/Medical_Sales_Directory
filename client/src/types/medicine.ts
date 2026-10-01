import type { IBrand } from "./brand";
import type { ICategory } from "./category";
import type { IMargin } from "./margin";

export interface IMedicine {
    _id?: string;
    name: string;
    brand: IBrand;
    category: ICategory;
    margin?: IMargin;
    batchNumber?: string;
    purchasePrice: number;
    sellingPrice: number;
    gst: 5 | 12 | 18 | 28 | undefined;
    stock?: number;
    manufactureDate?: Date;
    expiry: Date;
    description?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}