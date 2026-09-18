import { createContext, useContext } from "react";
import type { LoadingContextType } from "../utils/LoadingProvider";

export const LoadingContext = createContext<
    LoadingContextType | undefined
>(undefined);

export const useLoadingContext = () => {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error(
            "useLoadingContext must be used inside LoadingProvider"
        );
    }

    return context;
};