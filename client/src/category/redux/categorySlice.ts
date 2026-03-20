import { createSlice } from "@reduxjs/toolkit";
import type { ICategory } from "../../types/category";

interface CategoryState {
    categorys: ICategory[]
    selectedCategory: ICategory | null
}
const initialState: CategoryState = {
    categorys: [],
    selectedCategory: null,
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategorys: (state, action) => {
            state.categorys = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        },
        updateCategoryInList: (state, action) => {
            const updatedMed = action.payload;
            state.categorys = state.categorys.map((m) =>
                m._id === updatedMed._id ? updatedMed : m
            );
        }
    }
})

export const {
    setSelectedCategory,
    clearSelectedCategory,
    setCategorys,
    updateCategoryInList
} = categorySlice.actions
export default categorySlice.reducer