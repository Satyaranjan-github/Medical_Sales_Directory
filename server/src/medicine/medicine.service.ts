import type { IMedicine } from "../types/medicine";
import { Medicine } from "./medicine.model";

export const createMedicine = async (medicineData: IMedicine) => {
    return await Medicine.create(medicineData);
}

export const getAllMedicines = async () => {
    return await Medicine.find()
}

export const getMedicineById = async (id: string) => {
    return await Medicine.findById(id);
}

export const updateMedicine = async (id: string, medicineData: Partial<IMedicine>) => {
    return await Medicine.findByIdAndUpdate(id, medicineData, { new: true });
}

export const deleteMedicine = async (id: string) => {
    const medicine = await Medicine.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });

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
    }, { new: true });
}

export const deleteMedicinePermanently = async (id: string) => {
    const medicine = await Medicine.findById(id);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    return await Medicine.findByIdAndDelete(id);
}