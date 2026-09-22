import type { IMedicine } from "./medicine";

export enum PaymentMode {
    CASH = "CASH",
    CREDIT_CARD = "CREDIT CARD",
    DEBIT_CARD = "DEBIT CARD",
    NET_BANKING = "NET BANKING",
    UPI = "UPI",
    CHEQUE = "CHEQUE",
}

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    PARTIALLY_PAID = "PARTIALLY PAID",
}

export interface ISaleMedicineItem {
    _id?: string;
    medicine: IMedicine | string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface ISale {
    _id?: string;
    customerName: string;
    customerPhone: string;
    saleDate: Date;
    medicines: ISaleMedicineItem[];
    subTotal: number;
    discount: number;
    totalAmount: number;
    paymentMode: PaymentMode | string;
    paymentStatus: PaymentStatus | string;
    notes?: string;
    isDeleted?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    deletedAt?: string | Date;
}
