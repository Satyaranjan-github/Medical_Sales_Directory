export interface IMargin {
    _id?: string;
    title: string;
    value: number;
    description?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
