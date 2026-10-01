import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice.ts";
import medicineReducer from "./medicine/redux/medicineSlice.ts";
import marginReducer from "./margin/redux/marginSlice.ts";
import stockReducer from "./stock/redux/stockSlice.ts";

export const store = configureStore({
    reducer: {
        medicine: medicineReducer,
        margin: marginReducer,
        stock: stockReducer,

        [apiSlice.reducerPath]: apiSlice.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch