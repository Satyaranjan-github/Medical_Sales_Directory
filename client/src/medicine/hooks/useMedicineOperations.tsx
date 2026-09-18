import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useLoading from "../../hooks/useLoading";
import type { IMedicine } from "../../types/medicine";
import { useCreateMedicineMutation, useDeleteMedicineMutation, useDeleteMedicinePermanentlyMutation, useLazyGetMedicineByIdQuery, useRestoreMedicineMutation, useUpdateMedicineMutation } from "../api/medicineApi";
import { clearSelectedMedicine, updateMedicineInList } from "../redux/medicineSlice";

function useMedicineOperations() {
    const Loading = useLoading();
    const dispatch = useDispatch()
    const [triggerFetchById, {
        isLoading: isLoadingSingle
    }] = useLazyGetMedicineByIdQuery();

    const [updateMedicineMutation, { isLoading: isUpdatingMedicine }] = useUpdateMedicineMutation()
    const [deleteMedicineMutation, { isLoading: isDeletingMedicine }] = useDeleteMedicineMutation()
    const [deleteMedicinePermanentlyMutation, { isLoading: isDeletingMedicinePermanently }] = useDeleteMedicinePermanentlyMutation()
    const [restoreMedicineMutation, { isLoading: isRestoringMedicine }] = useRestoreMedicineMutation()
    const [createMedicineMutation, { isLoading: isCreatingMedicine }] = useCreateMedicineMutation()

    const getMedicineById = useCallback(async (id: string) => {
        if (isLoadingSingle) return false;

        try {
            if (id) {
                return await triggerFetchById(id).unwrap();
            }
        } catch (err) {
            console.error("Error fetching medicine:", err);
        }
    }, [isLoadingSingle, triggerFetchById]);

    const createMedicine = async (data: IMedicine) => {
        if (isCreatingMedicine) return false

        const isLoadingModal = Loading({ message: "Creating Medicine..." });

        try {
            await createMedicineMutation(data).unwrap();
            isLoadingModal()
            return true;
        } catch (error) {
            console.log("Error in Creating Medicine", error);
        }
    }

    const updateMedicine = async (data: IMedicine) => {
        if (isUpdatingMedicine) return false

        const isLoadingModal = Loading({ message: "Updating Medicine..." });

        try {
            const res = await updateMedicineMutation(data).unwrap();
            isLoadingModal()
            if (res.success) {
                dispatch(updateMedicineInList(res.data));
                dispatch(clearSelectedMedicine());
                return true;
            }
        }
        catch (error) {
            console.log("Error in updating Medicine", error)
        }
    }

    const deleteMedicine = async (id: string) => {
        if (isDeletingMedicine) return false

        const isLoadingModal = Loading({ message: "Deleting Medicine..." });

        try {
            await deleteMedicineMutation(id).unwrap()
            isLoadingModal()
            return true
        } catch (error) {
            console.log("Error in deleting Medicine", error)
        }
    }

    const restoreMedicine = async (id: string) => {
        if (isRestoringMedicine) return false

        const isLoadingModal = Loading({ message: "Restoring Medicine..." });

        try {
            await restoreMedicineMutation(id).unwrap()
            isLoadingModal()
            return true
        } catch (error) {
            isLoadingModal()
            console.log("Error in restoring Medicine", error)
        }
    }

    const deleteMedicinePermanently = async (id: string) => {
        if (isDeletingMedicinePermanently) return false

        const isLoadingModal = Loading({ message: "Deleting Medicine Permanently..." });

        try {
            await deleteMedicinePermanentlyMutation(id).unwrap()
            isLoadingModal()
            return true
        } catch (error) {
            console.log("Error in deleting MedicinePermanently", error)
        }
    }

    return {
        getMedicineById,
        createMedicine,
        deleteMedicine,
        restoreMedicine,
        updateMedicine,
        deleteMedicinePermanently
    };
}

export default useMedicineOperations