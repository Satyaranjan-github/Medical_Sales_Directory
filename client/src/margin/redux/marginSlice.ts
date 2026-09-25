import { createSlice } from "@reduxjs/toolkit";
import type { IMargin } from "../../types/margin";

interface MarginState {
    margins: IMargin[];
    selectedMargin: IMargin | null;
}

const initialState: MarginState = {
    margins: [],
    selectedMargin: null,
};

const marginSlice = createSlice({
    name: "margin",
    initialState,
    reducers: {
        setMargins: (state, action) => {
            state.margins = action.payload;
        },
        setSelectedMargin: (state, action) => {
            state.selectedMargin = action.payload;
        },
        clearSelectedMargin: (state) => {
            state.selectedMargin = null;
        },
        updateMarginInList: (state, action) => {
            const updatedMargin = action.payload;
            state.margins = state.margins.map((m) =>
                m._id === updatedMargin._id ? updatedMargin : m
            );
        }
    }
});

export const { setSelectedMargin, clearSelectedMargin, setMargins, updateMarginInList } = marginSlice.actions;
export default marginSlice.reducer;
