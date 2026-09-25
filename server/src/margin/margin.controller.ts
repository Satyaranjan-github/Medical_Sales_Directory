import type { Request, Response } from "express";
import {
    createMargin,
    deleteMargin,
    deleteMarginPermanently,
    getAllMargins,
    getMarginById,
    marginSuggestions,
    restoreMargin,
    updateMargin
} from "./margin.service";

export const createMarginController = async (req: Request, res: Response) => {
    const marginData = req.body;
    const newMargin = await createMargin(marginData);

    res.status(201).json({
        message: "Margin created successfully",
        data: newMargin,
        success: true
    });
};

export const getAllMarginsController = async (req: Request, res: Response) => {
    const pageStr = req.query.page as string | undefined;
    const limitStr = req.query.limit as string | undefined;

    const page = pageStr !== undefined ? Math.max(1, parseInt(pageStr, 10) || 1) : undefined;
    const limit = limitStr !== undefined ? Math.max(1, parseInt(limitStr, 10) || 9) : undefined;

    const result = await getAllMargins(page, limit);

    res.status(200).json({
        message: "Margins Fetched successfully",
        data: result.margins,
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
};

export const getMarginByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const margin = await getMarginById(id as string);

    res.status(200).json({
        message: "Margin Fetched Successfully",
        data: margin,
        success: true
    });
};

export const updateMarginController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const marginData = req.body;
    const updatedMargin = await updateMargin(id as string, marginData);

    res.status(200).json({
        message: "Margin Updated Successfully",
        data: updatedMargin,
        success: true
    });
};

export const deleteMarginController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedMargin = await deleteMargin(id as string);

    res.status(200).json({
        message: "Margin Deleted Successfully",
        data: deletedMargin,
        success: true
    });
};

export const restoreMarginController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const restoredMargin = await restoreMargin(id as string);

    res.status(200).json({
        message: "Margin Restored Successfully",
        data: restoredMargin,
        success: true
    });
};

export const deleteMarginPermanentlyController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedMargin = await deleteMarginPermanently(id as string);

    res.status(200).json({
        message: "Margin Permanently Deleted Successfully",
        data: deletedMargin,
        success: true
    });
};

export const marginSuggestionsController = async (req: Request, res: Response) => {
    const { query } = req.query;
    const suggestions = await marginSuggestions((query as string) || "");

    res.status(200).json({
        message: "Margin Suggestions Fetched Successfully",
        data: suggestions,
        success: true
    });
};
