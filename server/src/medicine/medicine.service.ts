import type { IMedicine } from "../types/medicine";
import { Medicine } from "./medicine.model";

const populatedFields = [
    { path: "brand", select: "_id name" },
];

export const createMedicine = async (medicineData: IMedicine) => {
    return await Medicine.create(medicineData);
}

export const getAllMedicines = async () => {
    return await Medicine.find().populate(populatedFields);
}

export const getMedicineById = async (id: string) => {
    return await Medicine.findById(id).populate(populatedFields);
}

export const updateMedicine = async (id: string, medicineData: Partial<IMedicine>) => {
    return await Medicine.findByIdAndUpdate(id, medicineData, { new: true }).populate(populatedFields);
}

export const deleteMedicine = async (id: string) => {
    const medicine = await Medicine.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true }).populate(populatedFields);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    return medicine;
}

export const restoreMedicine = async (id: string) => {
    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    await Medicine.findByIdAndUpdate(id, {
        isDeleted: false,
        deletedAt: null
    }, { new: true }).populate(populatedFields);
}

export const deleteMedicinePermanently = async (id: string) => {
    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    return await Medicine.findByIdAndDelete(id).populate(populatedFields);
}

export const medicineSuggestions = async (query: string) => {
    return await Medicine.find({
        name: { $regex: query, $options: "i" },
        isDeleted: false
    }).select("_id name");
}