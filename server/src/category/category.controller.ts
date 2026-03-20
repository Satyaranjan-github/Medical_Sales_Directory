import type { Request, Response } from "express";
import { createCategory, deleteCategory, deleteCategoryPermanently, getAllCategories, getCategoryById, restoreCategory, updateCategory } from "./category.service";


export const createCategoryController = async (req: Request, res: Response) => {
    const categoryData = req.body;
    const newCategory = await createCategory(categoryData)

    res.status(201).json({
        message: "Category created successfully",
        data: newCategory,
        success: true
    });
}

export const getAllCategorysController = async (req: Request, res: Response) => {
    const categorys = await getAllCategories();

    res.status(200).json({
        message: "Categorys Fetched successfully",
        data: categorys,
        success: true
    });
}

export const getCategoryByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await getCategoryById(id as string);

    res.status(200).json({
        message: "Category Fetched Successfully",
        data: category,
        success: true
    });
}

export const updateCategoryController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryData = req.body;

    const updatedCategory = await updateCategory(id as string, categoryData);

    res.status(200).json({
        message: "Category Updated Successfully",
        data: updatedCategory,
        success: true
    });
}

export const deleteCategoryController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedCategory = await deleteCategory(id as string);

    res.status(200).json({
        message: "Category Deleted Successfully",
        data: deletedCategory,
        success: true
    });
}

export const restoreCategoryController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const restoredCategory = await restoreCategory(id as string);

    res.status(200).json({
        message: "Category Restored Successfully",
        data: restoredCategory,
        success: true
    });
}

export const deleteCategoryPermanentlyController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedCategory = await deleteCategoryPermanently(id as string);

    res.status(200).json({
        message: "Category Permanently Deleted Successfully",
        data: deletedCategory,
        success: true
    });
}