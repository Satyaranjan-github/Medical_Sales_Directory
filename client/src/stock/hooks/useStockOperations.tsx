import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useLoading from "../../hooks/useLoading";
import type { IStock } from "../../types/stock";
import {
    useCreateStockMutation,
    useDeleteStockMutation,
    useDeleteStockPermanentlyMutation,
    useLazyGetStockByIdQuery,
    useRestoreStockMutation,
    useUpdateStockMutation
} from "../api/stockApi";
import { clearSelectedStock, updateStockInList } from "../redux/stockSlice";

function useStockOperations() {
    const Loading = useLoading();
    const dispatch = useDispatch();

    const [triggerFetchById, { isLoading: isLoadingSingle }] = useLazyGetStockByIdQuery();
    const [updateStockMutation, { isLoading: isUpdating }] = useUpdateStockMutation();
    const [deleteStockMutation, { isLoading: isDeleting }] = useDeleteStockMutation();
    const [deleteStockPermanentlyMutation, { isLoading: isDeletingPermanently }] = useDeleteStockPermanentlyMutation();
    const [restoreStockMutation, { isLoading: isRestoring }] = useRestoreStockMutation();
    const [createStockMutation, { isLoading: isCreating }] = useCreateStockMutation();

    const getStockById = useCallback(
        async (id: string) => {
            if (isLoadingSingle) return false;
            try {
                if (id) {
                    return await triggerFetchById(id).unwrap();
                }
            } catch (err) {
                console.error("Error fetching stock:", err);
            }
        },
        [isLoadingSingle, triggerFetchById]
    );

    const createStock = async (data: Partial<IStock>) => {
        if (isCreating) return false;
        const isLoadingModal = Loading({ message: "Creating Stock Record..." });
        try {
            await createStockMutation(data).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.error("Error in creating stock", error);
        }
    };

    const updateStock = async (data: Partial<IStock>) => {
        if (isUpdating) return false;
        const isLoadingModal = Loading({ message: "Updating Stock Record..." });
        try {
            const res = await updateStockMutation(data).unwrap();
            isLoadingModal();
            if (res.success) {
                dispatch(updateStockInList(res.data));
                dispatch(clearSelectedStock());
                return true;
            }
        } catch (error) {
            isLoadingModal();
            console.error("Error in updating stock", error);
        }
    };

    const deleteStock = async (id: string) => {
        if (isDeleting) return false;
        const isLoadingModal = Loading({ message: "Soft Deleting Stock..." });
        try {
            await deleteStockMutation(id).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.error("Error in deleting stock", error);
        }
    };

    const restoreStock = async (id: string) => {
        if (isRestoring) return false;
        const isLoadingModal = Loading({ message: "Restoring Stock..." });
        try {
            await restoreStockMutation(id).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.error("Error in restoring stock", error);
        }
    };

    const deleteStockPermanently = async (id: string) => {
        if (isDeletingPermanently) return false;
        const isLoadingModal = Loading({ message: "Deleting Stock Permanently..." });
        try {
            await deleteStockPermanentlyMutation(id).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.error("Error in permanently deleting stock", error);
        }
    };

    return {
        getStockById,
        createStock,
        deleteStock,
        restoreStock,
        updateStock,
        deleteStockPermanently
    };
}

export default useStockOperations;
