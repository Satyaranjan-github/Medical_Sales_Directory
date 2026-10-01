import type { Request, Response } from "express";
import {
    createStock,
    deleteStock,
    deleteStockPermanently,
    getAllStocks,
    getStockById,
    restoreStock,
    stockSuggestions,
    updateStock
} from "./stock.service";
import { stockSchema } from "./stock.validation";

export const createStockController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        let medicineId = body.medicine;

        if (typeof body.medicine === "object" && body.medicine !== null) {
            medicineId = body.medicine._id;
        }

        const payload = {
            ...body,
            medicine: medicineId
        };

        const validated = stockSchema.parse(payload);
        const stockData: any = {
            ...validated,
            medicine: typeof validated.medicine === "object" ? validated.medicine._id : validated.medicine
        };
        const newStock = await createStock(stockData);

        res.status(201).json({
            message: "Stock Created Successfully",
            data: newStock,
            success: true
        });
    } catch (error: any) {
        const errorMessage = error?.errors?.[0]?.message || error.message || "Failed to create stock";
        res.status(400).json({
            message: errorMessage,
            success: false
        });
    }
};

export const getAllStocksController = async (req: Request, res: Response): Promise<void> => {
    try {
        const pageStr = req.query.page as string | undefined;
        const limitStr = req.query.limit as string | undefined;

        const page = pageStr !== undefined ? Math.max(1, parseInt(pageStr, 10) || 1) : undefined;
        const limit = limitStr !== undefined ? Math.max(1, parseInt(limitStr, 10) || 10) : undefined;
        const status = req.query.status as string | undefined;

        const result = await getAllStocks(page, limit, status);

        res.status(200).json({
            message: "Stocks Fetched Successfully",
            data: result.stocks,
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
            message: error.message || "Failed to fetch stocks",
            success: false
        });
    }
};

export const getStockByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const stock = await getStockById(id as string);

        if (!stock) {
            res.status(404).json({
                message: "Stock Record Not Found",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "Stock Fetched Successfully",
            data: stock,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch stock",
            success: false
        });
    }
};

export const updateStockController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const body = req.body;

        let medicineId = body.medicine;
        if (typeof body.medicine === "object" && body.medicine !== null) {
            medicineId = body.medicine._id;
        }

        const updated = await updateStock(id as string, {
            ...body,
            medicine: medicineId
        });

        res.status(200).json({
            message: "Stock Updated Successfully",
            data: updated,
            success: true
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to update stock",
            success: false
        });
    }
};

export const deleteStockController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await deleteStock(id as string);

        res.status(200).json({
            message: "Stock Soft Deleted Successfully",
            data: deleted,
            success: true
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to delete stock",
            success: false
        });
    }
};

export const restoreStockController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const restored = await restoreStock(id as string);

        res.status(200).json({
            message: "Stock Restored Successfully",
            data: restored,
            success: true
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to restore stock",
            success: false
        });
    }
};

export const deleteStockPermanentlyController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await deleteStockPermanently(id as string);

        res.status(200).json({
            message: "Stock Permanently Deleted Successfully",
            data: deleted,
            success: true
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to permanently delete stock",
            success: false
        });
    }
};

export const stockSuggestionsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { query } = req.query;
        const suggestions = await stockSuggestions((query as string) || "");

        res.status(200).json({
            message: "Stock Suggestions Fetched Successfully",
            data: suggestions,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch stock suggestions",
            success: false
        });
    }
};
