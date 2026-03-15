import { createSlice } from "@reduxjs/toolkit";
import type { IMedicine } from "../../types/medicine";

interface MedicineState {
    medicines: IMedicine[]
    selectedMedicine: IMedicine | null
}
const initialState: MedicineState = {
    medicines: [],
    selectedMedicine: null,
}

const medicineSlice = createSlice({
    name: "medicine",
    initialState,
    reducers: {
        setMedicines: (state, action) => {
            state.medicines = action.payload;
        },
        setSelectedMedicine: (state, action) => {
            state.selectedMedicine = action.payload;
        },
        clearSelectedMedicine: (state) => {
            state.selectedMedicine = null;
        },
        updateMedicineInList: (state, action) => {
            const updatedMed = action.payload;
            state.medicines = state.medicines.map((m) =>
                m._id === updatedMed._id ? updatedMed : m
            );
        }
    }
})

export const { setSelectedMedicine, clearSelectedMedicine, setMedicines, updateMedicineInList } = medicineSlice.actions
export default medicineSlice.reducer