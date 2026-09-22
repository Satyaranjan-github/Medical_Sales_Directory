import type { ISale } from "../types/sale";
import { Sale } from "./sale.model";
import { Medicine } from "../medicine/medicine.model";

const populatedFields = [
    {
        path: "medicines.medicine",
        select: "_id name brand category batchNumber purchasePrice sellingPrice gst stock expiry",
        populate: [
            { path: "brand", select: "_id name" },
            { path: "category", select: "_id name" }
        ]
    }
];

export const createSale = async (saleData: ISale) => {
    const sale = await Sale.create(saleData);

    if (sale.medicines && sale.medicines.length > 0) {
        for (const item of sale.medicines) {
            if (item.medicine) {
                await Medicine.findByIdAndUpdate(item.medicine, {
                    $inc: { stock: -item.quantity }
                });
            }
        }
    }

    return await Sale.findById(sale._id).populate(populatedFields);
};

export const getAllSales = async (
    page?: number,
    limit?: number,
    filter: Record<string, any> = {}
) => {
    const query = { isDeleted: false, ...filter };

    if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const [sales, total] = await Promise.all([
            Sale.find(query).sort({ saleDate: -1, createdAt: -1 }).populate(populatedFields).skip(skip).limit(limit),
            Sale.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            sales,
            total,
            page,
            limit,
            totalPages
        };
    }

    const sales = await Sale.find(query).sort({ saleDate: -1, createdAt: -1 }).populate(populatedFields);
    const total = sales.length;
    return {
        sales,
        total,
        page: 1,
        limit: total,
        totalPages: 1
    };
};

export const getSaleById = async (id: string) => {
    return await Sale.findById(id).populate(populatedFields);
};

export const getSalesByMedicine = async (
    medicineId: string,
    page?: number,
    limit?: number
) => {
    const filter = { "medicines.medicine": medicineId, isDeleted: false };

    if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const [sales, total] = await Promise.all([
            Sale.find(filter).sort({ saleDate: -1, createdAt: -1 }).populate(populatedFields).skip(skip).limit(limit),
            Sale.countDocuments(filter)
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            sales,
            total,
            page,
            limit,
            totalPages
        };
    }

    const sales = await Sale.find(filter).sort({ saleDate: -1, createdAt: -1 }).populate(populatedFields);
    const total = sales.length;
    return {
        sales,
        total,
        page: 1,
        limit: total,
        totalPages: 1
    };
};

export const updateSale = async (id: string, saleData: Partial<ISale>) => {
    return await Sale.findByIdAndUpdate(id, saleData, { new: true }).populate(populatedFields);
};

export const deleteSale = async (id: string) => {
    const sale = await Sale.findById(id);

    if (!sale) {
        throw new Error("Sale record not found");
    }

    if (sale.isDeleted) {
        return sale;
    }

    const updatedSale = await Sale.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
            deletedAt: new Date()
        },
        { new: true }
    ).populate(populatedFields);

    if (sale.medicines && sale.medicines.length > 0) {
        for (const item of sale.medicines) {
            if (item.medicine) {
                await Medicine.findByIdAndUpdate(item.medicine, {
                    $inc: { stock: item.quantity }
                });
            }
        }
    }

    return updatedSale;
};

export const restoreSale = async (id: string) => {
    const sale = await Sale.findById(id);

    if (!sale) {
        throw new Error("Sale record not found");
    }

    if (!sale.isDeleted) {
        return await Sale.findById(id).populate(populatedFields);
    }

    const restoredSale = await Sale.findByIdAndUpdate(
        id,
        {
            isDeleted: false,
            deletedAt: null
        },
        { new: true }
    ).populate(populatedFields);

    if (sale.medicines && sale.medicines.length > 0) {
        for (const item of sale.medicines) {
            if (item.medicine) {
                await Medicine.findByIdAndUpdate(item.medicine, {
                    $inc: { stock: -item.quantity }
                });
            }
        }
    }

    return restoredSale;
};

export const deleteSalePermanently = async (id: string) => {
    const sale = await Sale.findById(id);

    if (!sale) {
        throw new Error("Sale record not found");
    }

    return await Sale.findByIdAndDelete(id).populate(populatedFields);
};