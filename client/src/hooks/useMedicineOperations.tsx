import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useCreateMedicineMutation, useDeleteMedicineMutation, useLazyGetMedicineByIdQuery, useRestoreMedicineMutation, useUpdateMedicineMutation } from "../api/medicineApi";
import { clearSelectedMedicine, updateMedicineInList } from "../redux/medicineSlice";
import type { IMedicine } from "../types/medicine";

function useMedicineOperations() {
    const dispatch = useDispatch()
    const [triggerFetchById, {
        isLoading: isLoadingSingle
    }] = useLazyGetMedicineByIdQuery();

    const [updateMedicineMutation, { isLoading: isUpdatingMedicine }] = useUpdateMedicineMutation()
    const [deleteMedicineMutation, { isLoading: isDeletingMedicine }] = useDeleteMedicineMutation()
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
        try {
            await createMedicineMutation(data).unwrap();
            return true;
        } catch (error) {
            console.log("Error in Creating Medicine", error);
        }
    }

    const updateMedicine = async (data: IMedicine) => {
        if (isUpdatingMedicine) return false

        try {
            const res = await updateMedicineMutation(data).unwrap();

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

        try {
            await deleteMedicineMutation(id).unwrap()
            return true
        } catch (error) {
            console.log("Error in deleting Medicine", error)
        }
    }

    const restoreMedicine = async (id: string) => {
        if (isRestoringMedicine) return false

        try {
            await restoreMedicineMutation(id).unwrap()
            return true
        } catch (error) {
            console.log("Error in restoring Medicine", error)
        }
    }

    return {
        getMedicineById,
        createMedicine,
        deleteMedicine,
        restoreMedicine,
        updateMedicine
    };
}

export default useMedicineOperations