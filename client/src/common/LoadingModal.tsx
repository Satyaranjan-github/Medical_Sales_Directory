import { Loader2 } from "lucide-react";
import { useLoadingContext } from "../provider/loadingProvider";

const LoadingModal = () => {
    const { isOpen, message } = useLoadingContext();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />

                <p className="text-slate-700 font-medium">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingModal;