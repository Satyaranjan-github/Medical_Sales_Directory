import type { IMedicine } from "../types/medicine";
import { Medicine } from "./medicine.model";
import { Stock } from "../stock/stock.model";
import {
    createStock,
    deleteStock,
    deleteStockPermanently,
    restoreStock,
    updateStock
} from "../stock/stock.service";

const populatedFields = [
    { path: "brand", select: "_id name" },
    { path: "category", select: "_id name" },
    { path: "margin", select: "_id title value" },
];

export const createMedicine = async (medicineData: IMedicine) => {
    const created = await Medicine.create(medicineData);

    const qty = Number(created.stock) || 0;
    const minLevel = 10;

    await createStock({
        medicine: created._id.toString(),
        quantity: qty,
        minStockLevel: minLevel,
        location: "Main Store",
        notes: `Initial stock automatically created for ${created.name}`
    });

    return await Medicine.findById(created._id).populate(populatedFields);
};

export const getAllMedicines = async (page?: number, limit?: number) => {
    if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const [medicines, total] = await Promise.all([
            Medicine.find().populate(populatedFields).skip(skip).limit(limit),
            Medicine.countDocuments()
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            medicines,
            total,
            page,
            limit,
            totalPages
        };
    }

    const medicines = await Medicine.find().populate(populatedFields);
    const total = medicines.length;
    return {
        medicines,
        total,
        page: 1,
        limit: total,
        totalPages: 1
    };
};

export const getMedicineById = async (id: string) => {
    return await Medicine.findById(id).populate(populatedFields);
};

export const updateMedicine = async (id: string, medicineData: Partial<IMedicine>) => {
    const updated = await Medicine.findByIdAndUpdate(id, medicineData, { new: true }).populate(populatedFields);

    if (medicineData.stock !== undefined && updated) {
        const qty = Number(medicineData.stock) || 0;
        const existingStock = await Stock.findOne({ medicine: id, isDeleted: false });

        if (existingStock) {
            await updateStock(existingStock._id.toString(), { quantity: qty });
        } else {
            await createStock({
                medicine: id,
                quantity: qty,
                minStockLevel: 10,
                location: "Main Store"
            });
        }
    }

    return updated;
};

export const deleteMedicine = async (id: string) => {
    const medicine = await Medicine.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true }).populate(populatedFields);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    // Soft delete stock entry using stock service
    const stock = await Stock.findOne({ medicine: id, isDeleted: false });
    if (stock) {
        await deleteStock(stock._id.toString());
    }

    return medicine;
};

export const restoreMedicine = async (id: string) => {
    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    const restored = await Medicine.findByIdAndUpdate(id, {
        isDeleted: false,
        deletedAt: null
    }, { new: true }).populate(populatedFields);

    // Restore stock entry using stock service
    const stock = await Stock.findOne({ medicine: id, isDeleted: true });
    if (stock) {
        await restoreStock(stock._id.toString());
    }

    return restored;
};

export const deleteMedicinePermanently = async (id: string) => {
    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    const deleted = await Medicine.findByIdAndDelete(id);

    // Permanently delete stock entry using stock service
    const stock = await Stock.findOne({ medicine: id });
    if (stock) {
        await deleteStockPermanently(stock._id.toString());
    }

    return deleted;
};

export const medicineSuggestions = async (query: string) => {
    return await Medicine.find({
        name: { $regex: query, $options: "i" },
        isDeleted: false
    }).select("_id name");
};