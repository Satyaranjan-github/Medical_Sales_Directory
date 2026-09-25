import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle,
    FileText,
    Percent,
    Save,
    Tag,
    X
} from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type { IMargin } from "../../types/margin";
import useMarginOperations from "../hooks/useMarginOperations";
import { marginSchema, type MarginFormData } from "../validation/marginSchema";

const MarginFormModal = ({
    setOpenModal,
    marginData
}: {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    marginData?: IMargin;
}) => {
    const isUpdate = !!marginData;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<MarginFormData>({
        resolver: zodResolver(marginSchema),
        mode: "onChange",
        defaultValues: {
            ...marginData,
        }
    });

    const { createMargin, updateMargin } = useMarginOperations();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        if (isUpdate) {
            await updateMargin(data as IMargin);
        } else {
            await createMargin(data as IMargin);
        }
        setOpenModal(false);
    };

    useEffect(() => {
        if (!marginData) return;
        reset({
            ...marginData
        });
    }, [marginData, reset]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
            {/* MODAL DIALOG CONTAINER */}
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 transition-all duration-300 animate-in zoom-in-95 duration-200">
                
                {/* 1. HEADER */}
                <header className="p-4 sm:p-5.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-xs transition-colors duration-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <Percent size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                {isUpdate ? "Update Margin" : "Add New Margin"}
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                {isUpdate ? "Modify margin settings & details" : "Register a new margin rule"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </header>

                {/* 2. SCROLLABLE MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto">
                    <form id="margin-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="title">
                                Margin Title <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="title"
                                    {...register("title")}
                                    placeholder="e.g. Standard Retail Margin, Wholesale Rate"
                                    className={`w-full text-sm font-semibold pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${errors.title
                                        ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:border-rose-500"
                                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        }`}
                                />
                            </div>
                            {errors.title && (
                                <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1.5 font-bold">
                                    <AlertCircle size={12} />
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Value */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="value">
                                Margin Value (%) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Percent size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
                                <input
                                    id="value"
                                    type="number"
                                    step="0.01"
                                    {...register("value", { valueAsNumber: true })}
                                    placeholder="e.g. 15.5"
                                    className={`w-full text-sm font-extrabold text-emerald-700 dark:text-emerald-300 pl-10 pr-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${errors.value ? "border-rose-400" : ""}`}
                                />
                            </div>
                            {errors.value && (
                                <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1.5 font-bold">
                                    <AlertCircle size={12} />
                                    {errors.value.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">
                                Description
                            </label>
                            <div className="relative">
                                <FileText size={16} className="absolute left-3.5 top-3 text-slate-400" />
                                <textarea
                                    id="description"
                                    rows={3}
                                    {...register("description")}
                                    placeholder="Enter details about this margin tier..."
                                    className="w-full text-sm font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </form>
                </main>

                {/* 3. FOOTER */}
                <footer className="p-4 sm:p-5.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky bottom-0 z-20 shadow-xs transition-colors duration-200 shrink-0">
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="flex-1 py-3 px-4 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer text-sm mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="margin-form"
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                        <Save size={18} />
                        {isUpdate ? "Save Margin Record" : "Create Margin Entry"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MarginFormModal;
