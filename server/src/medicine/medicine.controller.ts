import type { Request, Response } from "express";
import { createMedicine, deleteMedicine, deleteMedicinePermanently, getAllMedicines, getMedicineById, medicineSuggestions, restoreMedicine, updateMedicine } from "./medicine.service";


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
    const pageStr = req.query.page as string | undefined;
    const limitStr = req.query.limit as string | undefined;

    const page = pageStr !== undefined ? Math.max(1, parseInt(pageStr, 10) || 1) : undefined;
    const limit = limitStr !== undefined ? Math.max(1, parseInt(limitStr, 10) || 9) : undefined;

    const result = await getAllMedicines(page, limit);

    res.status(200).json({
        message: "Medicines Fetched successfully",
        data: result.medicines,
        pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        },
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
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

export const medicineSuggestionsController = async (req: Request, res: Response) => {
    const { query } = req.query;
    const suggestions = await medicineSuggestions(query as string);

    res.status(200).json({
        message: "Medicine Suggestions Fetched Successfully",
        data: suggestions,
        success: true
    });
}