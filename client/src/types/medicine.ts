import type { IBrand } from "./brand";
import type { ICategory } from "./category";

export interface IMedicine {
    _id?: string;
    name: string;
    cost: number;
    gst: number;
    discount: number;
    brand: IBrand
    category: ICategory
    expiry: Date;
    description?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}