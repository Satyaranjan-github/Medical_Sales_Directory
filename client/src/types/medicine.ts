export interface IMedicine {
    _id?: string;
    name: string;
    cost: number;
    gst: number;
    discount: number;
    expiry: Date;
    description?: string;
    isDeleted?: boolean;
    createdAt?: Date;  //completed
    updatedAt?: Date;  //completed
    deletedAt?: Date;  //completed
}