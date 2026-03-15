import { createSlice } from "@reduxjs/toolkit";
import type { IBrand } from "../../types/brand";

interface BrandState {
    brands: IBrand[]
    selectedBrand: IBrand | null
}
const initialState: BrandState = {
    brands: [],
    selectedBrand: null,
}

const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setBrands: (state, action) => {
            state.brands = action.payload;
        },
        setSelectedBrand: (state, action) => {
            state.selectedBrand = action.payload;
        },
        clearSelectedBrand: (state) => {
            state.selectedBrand = null;
        },
        updateBrandInList: (state, action) => {
            const updatedMed = action.payload;
            state.brands = state.brands.map((m) =>
                m._id === updatedMed._id ? updatedMed : m
            );
        }
    }
})

export const {
    setSelectedBrand,
    clearSelectedBrand,
    setBrands,
    updateBrandInList
} = brandSlice.actions
export default brandSlice.reducer