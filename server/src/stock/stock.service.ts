import type { IStock } from "../types/stock";
import { Stock } from "./stock.model";
import { Medicine } from "../medicine/medicine.model";

const populatedFields = [
    {
        path: "medicine",
        select: "_id name batchNumber purchasePrice sellingPrice gst stock expiry",
        populate: [
            { path: "brand", select: "_id name" },
            { path: "category", select: "_id name" },
            { path: "margin", select: "_id title value" }
        ]
    }
];

export const computeStockStatus = (quantity: number, minLevel: number = 10): "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" => {
    if (quantity <= 0) return "OUT_OF_STOCK";
    if (quantity <= minLevel) return "LOW_STOCK";
    return "IN_STOCK";
};

export const createStock = async (stockData: Partial<IStock>) => {
    const qty = Number(stockData.quantity) || 0;
    const minLevel = Number(stockData.minStockLevel) || 10;
    const computedStatus = computeStockStatus(qty, minLevel);

    const created = await Stock.create({
        ...stockData,
        quantity: qty,
        minStockLevel: minLevel,
        status: computedStatus
    });

    if (stockData.medicine) {
        await Medicine.findByIdAndUpdate(stockData.medicine, { stock: qty });
    }

    return await Stock.findById(created._id).populate(populatedFields);
};

export const getAllStocks = async (page?: number, limit?: number, status?: string) => {
    const query: any = {};
    if (status && ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].includes(status)) {
        query.status = status;
    }

    if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const [stocks, total] = await Promise.all([
            Stock.find(query).populate(populatedFields).sort({ updatedAt: -1 }).skip(skip).limit(limit),
            Stock.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            stocks,
            total,
            page,
            limit,
            totalPages
        };
    }

    const stocks = await Stock.find(query).populate(populatedFields).sort({ updatedAt: -1 });
    const total = stocks.length;
    return {
        stocks,
        total,
        page: 1,
        limit: total,
        totalPages: 1
    };
};

export const getStockById = async (id: string) => {
    return await Stock.findById(id).populate(populatedFields);
};

export const updateStock = async (id: string, stockData: Partial<IStock>) => {
    const currentStock = await Stock.findById(id);
    if (!currentStock) {
        throw new Error("Stock record not found");
    }

    const qty = stockData.quantity !== undefined ? Number(stockData.quantity) : currentStock.quantity;
    const minLevel = stockData.minStockLevel !== undefined ? Number(stockData.minStockLevel) : currentStock.minStockLevel;
    const computedStatus = computeStockStatus(qty, minLevel);

    const updated = await Stock.findByIdAndUpdate(
        id,
        {
            ...stockData,
            quantity: qty,
            minStockLevel: minLevel,
            status: computedStatus
        },
        { new: true }
    ).populate(populatedFields);

    if (updated?.medicine) {
        const medicineId = typeof updated.medicine === "object" ? (updated.medicine as any)._id : updated.medicine;
        await Medicine.findByIdAndUpdate(medicineId, { stock: qty });
    }

    return updated;
};

export const deleteStock = async (id: string) => {
    const stock = await Stock.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
            deletedAt: new Date()
        },
        { new: true }
    ).populate(populatedFields);

    if (!stock) {
        throw new Error("Stock record not found");
    }

    return stock;
};

export const restoreStock = async (id: string) => {
    const stock = await Stock.findById(id);

    if (!stock) {
        throw new Error("Stock record not found");
    }

    return await Stock.findByIdAndUpdate(
        id,
        {
            isDeleted: false,
            deletedAt: null
        },
        { new: true }
    ).populate(populatedFields);
};

export const deleteStockPermanently = async (id: string) => {
    const stock = await Stock.findById(id);

    if (!stock) {
        throw new Error("Stock record not found");
    }

    return await Stock.findByIdAndDelete(id);
};

export const stockSuggestions = async (query: string) => {
    const stocks = await Stock.find({ isDeleted: false })
        .populate({
            path: "medicine",
            match: { name: { $regex: query || "", $options: "i" } },
            select: "_id name"
        })
        .select("_id medicine quantity status location");

    return stocks.filter((s) => s.medicine !== null);
};
