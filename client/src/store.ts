import { configureStore } from "@reduxjs/toolkit";
import { medicineApi } from "./api/medicineApi.ts";
import medicineReducer from "./redux/medicineSlice.ts";

export const store = configureStore({
    reducer: {
        medicine: medicineReducer,
        [medicineApi.reducerPath]: medicineApi.reducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(medicineApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch