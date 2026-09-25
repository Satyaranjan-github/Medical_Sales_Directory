import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useLoading from "../../hooks/useLoading";
import type { IMargin } from "../../types/margin";
import {
    useCreateMarginMutation,
    useDeleteMarginMutation,
    useDeleteMarginPermanentlyMutation,
    useLazyGetMarginByIdQuery,
    useRestoreMarginMutation,
    useUpdateMarginMutation
} from "../api/marginApi";
import { clearSelectedMargin, updateMarginInList } from "../redux/marginSlice";

function useMarginOperations() {
    const Loading = useLoading();
    const dispatch = useDispatch();
    const [triggerFetchById, { isLoading: isLoadingSingle }] = useLazyGetMarginByIdQuery();

    const [updateMarginMutation, { isLoading: isUpdatingMargin }] = useUpdateMarginMutation();
    const [deleteMarginMutation, { isLoading: isDeletingMargin }] = useDeleteMarginMutation();
    const [deleteMarginPermanentlyMutation, { isLoading: isDeletingMarginPermanently }] = useDeleteMarginPermanentlyMutation();
    const [restoreMarginMutation, { isLoading: isRestoringMargin }] = useRestoreMarginMutation();
    const [createMarginMutation, { isLoading: isCreatingMargin }] = useCreateMarginMutation();

    const getMarginById = useCallback(async (id: string) => {
        if (isLoadingSingle) return false;

        try {
            if (id) {
                return await triggerFetchById(id).unwrap();
            }
        } catch (err) {
            console.error("Error fetching margin:", err);
        }
    }, [isLoadingSingle, triggerFetchById]);

    const createMargin = async (data: IMargin) => {
        if (isCreatingMargin) return false;

        const isLoadingModal = Loading({ message: "Creating Margin..." });

        try {
            await createMarginMutation(data).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.log("Error in Creating Margin", error);
        }
    };

    const updateMargin = async (data: IMargin) => {
        if (isUpdatingMargin) return false;

        const isLoadingModal = Loading({ message: "Updating Margin..." });

        try {
            const res = await updateMarginMutation(data).unwrap();
            isLoadingModal();
            if (res.success) {
                dispatch(updateMarginInList(res.data));
                dispatch(clearSelectedMargin());
                return true;
            }
        } catch (error) {
            isLoadingModal();
            console.log("Error in updating Margin", error);
        }
    };

    const deleteMargin = async (id: string) => {
        if (isDeletingMargin) return false;

        const isLoadingModal = Loading({ message: "Deleting Margin..." });

        try {
            await deleteMarginMutation(id).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.log("Error in deleting Margin", error);
        }
    };

    const restoreMargin = async (id: string) => {
        if (isRestoringMargin) return false;

        const isLoadingModal = Loading({ message: "Restoring Margin..." });

        try {
            await restoreMarginMutation(id).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.log("Error in restoring Margin", error);
        }
    };

    const deleteMarginPermanently = async (id: string) => {
        if (isDeletingMarginPermanently) return false;

        const isLoadingModal = Loading({ message: "Deleting Margin Permanently..." });

        try {
            await deleteMarginPermanentlyMutation(id).unwrap();
            isLoadingModal();
            return true;
        } catch (error) {
            isLoadingModal();
            console.log("Error in deleting Margin Permanently", error);
        }
    };

    return {
        getMarginById,
        createMargin,
        deleteMargin,
        restoreMargin,
        updateMargin,
        deleteMarginPermanently
    };
}

export default useMarginOperations;
