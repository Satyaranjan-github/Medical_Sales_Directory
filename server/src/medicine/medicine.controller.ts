import type { Request, Response } from "express";
import { createMedicine, deleteMedicine, deleteMedicinePermanently, getAllMedicines, getMedicineById, restoreMedicine, updateMedicine } from "./medicine.service";


export const createMedicineController = async (req: Request, res: Response) => {
    const medicineData = req.body;

    const newMedicine = await createMedicine(medicineData);

    res.status(201).json({
        message: "Medicine created successfully",
        data: newMedicine,
        success: true
    });
}

export const getAllMedicinesController = async (req: Request, res: Response) => {
    const medicines = await getAllMedicines();

    res.status(200).json({
        message: "Medicines Fetched successfully",
        data: medicines,
        success: true
    });
}

export const getMedicineByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const medicine = await getMedicineById(id as string);

    res.status(200).json({
        message: "Medicine Fetched Successfully",
        data: medicine,
        success: true
    });
}

export const updateMedicineController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const medicineData = req.body;
    
    const updatedMedicine = await updateMedicine(id as string, medicineData);

    res.status(200).json({
        message: "Medicine Updated Successfully",
        data: updatedMedicine,
        success: true
    });
}

export const deleteMedicineController = async (req: Request, res: Response) => {
    const id = req.params.id

    const deletedMedicine = await deleteMedicine(id as string);

    res.status(200).json({
        message: "Medicine Deleted Successfully",
        data: deletedMedicine,
        success: true
    });
}

export const restoreMedicineController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const restoredMedicine = await restoreMedicine(id as string);

    res.status(200).json({
        message: "Medicine Restored Successfully",
        data: restoredMedicine,
        success: true
    });
}

export const deleteMedicinePermanentlyController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedMedicine = await deleteMedicinePermanently(id as string);

    res.status(200).json({
        message: "Medicine Permanently Deleted Successfully",
        data: deletedMedicine,
        success: true
    });
}