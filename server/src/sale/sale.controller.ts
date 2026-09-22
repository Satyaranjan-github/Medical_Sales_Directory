import type { Request, Response } from "express";
import {
    createSale,
    deleteSale,
    deleteSalePermanently,
    getAllSales,
    getSaleById,
    getSalesByMedicine,
    restoreSale,
    updateSale
} from "./sale.service";

export const createSaleController = async (req: Request, res: Response) => {
    try {
        const saleData = req.body;
        const newSale = await createSale(saleData);

        res.status(201).json({
            message: "Sale record created successfully",
            data: newSale,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to create sale record",
            success: false
        });
    }
};

export const getAllSalesController = async (req: Request, res: Response) => {
    try {
        const pageStr = req.query.page as string | undefined;
        const limitStr = req.query.limit as string | undefined;

        const page = pageStr !== undefined ? Math.max(1, parseInt(pageStr, 10) || 1) : undefined;
        const limit = limitStr !== undefined ? Math.max(1, parseInt(limitStr, 10) || 10) : undefined;

        const result = await getAllSales(page, limit);

        res.status(200).json({
            message: "Sales fetched successfully",
            data: result.sales,
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
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch sales",
            success: false
        });
    }
};

export const getSaleByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sale = await getSaleById(id as string);

        if (!sale) {
            res.status(404).json({
                message: "Sale record not found",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "Sale record fetched successfully",
            data: sale,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch sale record",
            success: false
        });
    }
};

export const getSalesByMedicineController = async (req: Request, res: Response) => {
    try {
        const { medicineId } = req.params;
        const pageStr = req.query.page as string | undefined;
        const limitStr = req.query.limit as string | undefined;

        const page = pageStr !== undefined ? Math.max(1, parseInt(pageStr, 10) || 1) : undefined;
        const limit = limitStr !== undefined ? Math.max(1, parseInt(limitStr, 10) || 10) : undefined;

        const result = await getSalesByMedicine(medicineId as string, page, limit);

        res.status(200).json({
            message: "Sales for medicine fetched successfully",
            data: result.sales,
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
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch sales for medicine",
            success: false
        });
    }
};

export const updateSaleController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const saleData = req.body;

        const updatedSale = await updateSale(id as string, saleData);

        res.status(200).json({
            message: "Sale record updated successfully",
            data: updatedSale,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to update sale record",
            success: false
        });
    }
};

export const deleteSaleController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedSale = await deleteSale(id as string);

        res.status(200).json({
            message: "Sale record deleted (soft delete) successfully",
            data: deletedSale,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to delete sale record",
            success: false
        });
    }
};

export const restoreSaleController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const restoredSale = await restoreSale(id as string);

        res.status(200).json({
            message: "Sale record restored successfully",
            data: restoredSale,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to restore sale record",
            success: false
        });
    }
};

export const deleteSalePermanentlyController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedSale = await deleteSalePermanently(id as string);

        res.status(200).json({
            message: "Sale record deleted permanently",
            data: deletedSale,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to delete sale record permanently",
            success: false
        });
    }
};