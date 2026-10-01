import { createSlice } from "@reduxjs/toolkit";
import type { IStock } from "../../types/stock";

interface StockState {
    stocks: IStock[];
    selectedStock: IStock | null;
}

const initialState: StockState = {
    stocks: [],
    selectedStock: null
};

const stockSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {
        setStocks: (state, action) => {
            state.stocks = action.payload;
        },
        setSelectedStock: (state, action) => {
            state.selectedStock = action.payload;
        },
        clearSelectedStock: (state) => {
            state.selectedStock = null;
        },
        updateStockInList: (state, action) => {
            const updated = action.payload;
            state.stocks = state.stocks.map((s) => (s._id === updated._id ? updated : s));
        }
    }
});

export const { setStocks, setSelectedStock, clearSelectedStock, updateStockInList } = stockSlice.actions;
export default stockSlice.reducer;
