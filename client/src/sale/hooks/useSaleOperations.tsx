import useLoading from "../../hooks/useLoading";
import type { ISale } from "../../types/sale";
import {
    useCreateSaleMutation,
    useDeleteSaleMutation,
    useDeleteSalePermanentlyMutation,
    useRestoreSaleMutation,
    useUpdateSaleMutation
} from "../api/saleApi";

function useSaleOperations() {
    const Loading = useLoading();
    const [createSaleMutation, { isLoading: isCreatingSale }] = useCreateSaleMutation();
    const [updateSaleMutation, { isLoading: isUpdatingSale }] = useUpdateSaleMutation();
    const [deleteSaleMutation, { isLoading: isDeletingSale }] = useDeleteSaleMutation();
    const [restoreSaleMutation, { isLoading: isRestoringSale }] = useRestoreSaleMutation();
    const [deleteSalePermanentlyMutation, { isLoading: isDeletingPermanently }] = useDeleteSalePermanentlyMutation();

    const createSale = async (data: Partial<ISale>) => {
        if (isCreatingSale) return false;
        const stopLoading = Loading({ message: "Recording Sale POS Entry..." });
        try {
            const res = await createSaleMutation(data).unwrap();
            stopLoading();
            return res;
        } catch (error) {
            stopLoading();
            console.error("Error creating sale:", error);
            throw error;
        }
    };

    const updateSale = async (id: string, sale: Partial<ISale>) => {
        if (isUpdatingSale) return false;
        const stopLoading = Loading({ message: "Updating Sale Record..." });
        try {
            const res = await updateSaleMutation({ id, sale }).unwrap();
            stopLoading();
            return res;
        } catch (error) {
            stopLoading();
            console.error("Error updating sale:", error);
            throw error;
        }
    };

    const deleteSale = async (id: string) => {
        if (isDeletingSale) return false;
        const stopLoading = Loading({ message: "Soft-deleting Sale Record & Replenishing Stock..." });
        try {
            const res = await deleteSaleMutation(id).unwrap();
            stopLoading();
            return res;
        } catch (error) {
            stopLoading();
            console.error("Error deleting sale:", error);
            throw error;
        }
    };

    const restoreSale = async (id: string) => {
        if (isRestoringSale) return false;
        const stopLoading = Loading({ message: "Restoring Sale Record & Deducting Stock..." });
        try {
            const res = await restoreSaleMutation(id).unwrap();
            stopLoading();
            return res;
        } catch (error) {
            stopLoading();
            console.error("Error restoring sale:", error);
            throw error;
        }
    };

    const deleteSalePermanently = async (id: string) => {
        if (isDeletingPermanently) return false;
        const stopLoading = Loading({ message: "Permanently Deleting Sale Record..." });
        try {
            const res = await deleteSalePermanentlyMutation(id).unwrap();
            stopLoading();
            return res;
        } catch (error) {
            stopLoading();
            console.error("Error permanently deleting sale:", error);
            throw error;
        }
    };

    return {
        createSale,
        updateSale,
        deleteSale,
        restoreSale,
        deleteSalePermanently,
        isCreatingSale,
        isUpdatingSale,
        isDeletingSale,
        isRestoringSale,
        isDeletingPermanently
    };
}

export default useSaleOperations;
