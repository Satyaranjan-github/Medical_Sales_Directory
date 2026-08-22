import { useCallback } from "react";
import { useDispatch } from "react-redux";
import type { ICategory } from "../../types/category";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useLazyGetCategoryByIdQuery, useRestoreCategoryMutation, useUpdateCategoryMutation } from "../api/categoryApi";
import { clearSelectedCategory, updateCategoryInList } from "../redux/categorySlice";

function useCategoryOperations() {
    const dispatch = useDispatch()
    const [triggerFetchById, {
        isLoading: isLoadingSingle
    }] = useLazyGetCategoryByIdQuery();

    const [updateCategoryMutation, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation()
    const [deleteCategoryMutation, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation()
    const [restoreCategoryMutation, { isLoading: isRestoringCategory }] = useRestoreCategoryMutation()
    const [createCategoryMutation, { isLoading: isCreatingCategory }] = useCreateCategoryMutation()

    const getCategoryById = useCallback(async (id: string) => {
        if (isLoadingSingle) return false;

        try {
            if (id) {
                return await triggerFetchById(id).unwrap();
            }
        } catch (err) {
            console.error("Error fetching category:", err);
        }
    }, [isLoadingSingle, triggerFetchById]);

    const createCategory = async (data: ICategory) => {
        if (isCreatingCategory) return false
        try {
            await createCategoryMutation(data).unwrap();
            return true;
        } catch (error) {
            console.log("Error in Creating Category", error);
        }
    }

    const updateCategory = async (data: ICategory) => {
        if (isUpdatingCategory) return false

        try {
            const res = await updateCategoryMutation(data).unwrap();

            if (res.success) {
                dispatch(updateCategoryInList(res.data));
                dispatch(clearSelectedCategory());
                return true;
            }
        }
        catch (error) {
            console.log("Error in updating Category", error)
        }
    }

    const deleteCategory = async (id: string) => {
        if (isDeletingCategory) return false

        try {
            await deleteCategoryMutation(id).unwrap()
            return true
        } catch (error) {
            console.log("Error in deleting Category", error)
        }
    }

    const restoreCategory = async (id: string) => {
        if (isRestoringCategory) return false

        try {
            await restoreCategoryMutation(id).unwrap()
            return true
        } catch (error) {
            console.log("Error in restoring Category", error)
        }
    }

    return {
        getCategoryById,
        createCategory,
        deleteCategory,
        restoreCategory,
        updateCategory
    };
}

export default useCategoryOperations