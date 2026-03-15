import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice.ts";
import medicineReducer from "./medicine/redux/medicineSlice.ts";

export const store = configureStore({
    reducer: {
        medicine: medicineReducer,

        [apiSlice.reducerPath]: apiSlice.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch