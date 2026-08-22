import {
    type ReactNode,
    useState
} from "react";
import { LoadingContext } from "../provider/loadingProvider";

export interface LoadingContextType {
    show: (message?: string) => void;
    hide: () => void;
    isOpen: boolean;
    message: string;
}

export const LoadingProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("Loading...");

    const show = (msg?: string) => {
        if (msg) setMessage(msg);
        setIsOpen(true);
    };

    const hide = () => {
        setIsOpen(false);
    };

    return (
        <LoadingContext.Provider
            value={{
                show,
                hide,
                isOpen,
                message,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};