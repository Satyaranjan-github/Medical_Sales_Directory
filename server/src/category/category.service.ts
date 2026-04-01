import type { ICategory } from "../types/category";
import { Category } from "./category.model";

export const createCategory = async (CategoryData: ICategory) => {
    return await Category.create(CategoryData);
}

export const getAllCategories = async () => {
    return await Category.find();
}

export const getCategoryById = async (id: string) => {
    return await Category.findById(id);
}

export const updateCategory = async (id: string, CategoryData: Partial<ICategory>) => {
    return await
        Category.findByIdAndUpdate(id,
            CategoryData, { new: true }
        );
}

export const deleteCategory = async (id: string) => {
    const category = await Category.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });

    if (!category) {
        throw new Error("Category not found");
    }

    return category;
}

export const restoreCategory = async (id: string) => {
    const category = await Category.findById(id);

    if (!category) {
        throw new Error("Category not found");
    }

    await Category.findByIdAndUpdate(id, {
        isDeleted: false,
        deletedAt: null
    }, { new: true });
}

export const deleteCategoryPermanently = async (id: string) => {
    const category = await Category.findById(id);

    if (!category) {
        throw new Error("Category not found");
    }

    return await Category.findByIdAndDelete(id);
}

export const categorySuggestions = async (query: string) => {
    return await Category.find({
        name: { $regex: query, $options: "i" },
        isDeleted: false
    }).select("_id name");
}