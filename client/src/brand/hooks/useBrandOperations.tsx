import { useCallback } from "react";
import { useDispatch } from "react-redux";
import type { IBrand } from "../../types/brand";
import { useCreateBrandMutation, useDeleteBrandMutation, useLazyGetBrandByIdQuery, useRestoreBrandMutation, useUpdateBrandMutation } from "../api/brandApi";
import { clearSelectedBrand, updateBrandInList } from "../redux/brandSlice";

function useBrandOperations() {
    const dispatch = useDispatch()
    const [triggerFetchById, {
        isLoading: isLoadingSingle
    }] = useLazyGetBrandByIdQuery();

    const [updateBrandMutation, { isLoading: isUpdatingBrand }] = useUpdateBrandMutation()
    const [deleteBrandMutation, { isLoading: isDeletingBrand }] = useDeleteBrandMutation()
    const [restoreBrandMutation, { isLoading: isRestoringBrand }] = useRestoreBrandMutation()
    const [createBrandMutation, { isLoading: isCreatingBrand }] = useCreateBrandMutation()

    const getBrandById = useCallback(async (id: string) => {
        if (isLoadingSingle) return false;

        try {
            if (id) {
                return await triggerFetchById(id).unwrap();
            }
        } catch (err) {
            console.error("Error fetching brand:", err);
        }
    }, [isLoadingSingle, triggerFetchById]);

    const createBrand = async (data: IBrand) => {
        if (isCreatingBrand) return false
        try {
            await createBrandMutation(data).unwrap();
            return true;
        } catch (error) {
            console.log("Error in Creating Brand", error);
        }
    }

    const updateBrand = async (data: IBrand) => {
        if (isUpdatingBrand) return false

        try {
            const res = await updateBrandMutation(data).unwrap();

            if (res.success) {
                dispatch(updateBrandInList(res.data));
                dispatch(clearSelectedBrand());
                return true;
            }
        }
        catch (error) {
            console.log("Error in updating Brand", error)
        }
    }

    const deleteBrand = async (id: string) => {
        if (isDeletingBrand) return false

        try {
            await deleteBrandMutation(id).unwrap()
            return true
        } catch (error) {
            console.log("Error in deleting Brand", error)
        }
    }

    const restoreBrand = async (id: string) => {
        if (isRestoringBrand) return false

        try {
            await restoreBrandMutation(id).unwrap()
            return true
        } catch (error) {
            console.log("Error in restoring Brand", error)
        }
    }

    return {
        getBrandById,
        createBrand,
        deleteBrand,
        restoreBrand,
        updateBrand
    };
}

export default useBrandOperations