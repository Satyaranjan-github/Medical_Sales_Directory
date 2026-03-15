export interface IBrand {
    _id?: string;
    name: string;
    description?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}