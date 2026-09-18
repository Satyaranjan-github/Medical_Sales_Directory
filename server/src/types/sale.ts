import type { Types } from "mongoose"
import type { IMedicine } from "./medicine"

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

export interface SaleMedicine {
    medicine: Types.ObjectId | IMedicine
    quantity: number
    unitPrice: number
    totalPrice: number
}

export interface ISale extends Document {
    customerName: string
    customerPhone: string
    saleDate: Date;
    medicines: SaleMedicine[]
    subTotal: number
    discount: number
    totalAmount: number
    paymentMode: PaymentMode
    paymentStatus: PaymentStatus
    notes: string
    createdAt?: Date
    updatedAt?: Date
    isDeleted: boolean
    ,
    deletedAt?: Date
}