import { Boxes, MapPin, Notebook, Hash, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IStock } from "../../types/stock";
import MedicineSelect from "../../medicine/components/MedicineSelect";
import useStockOperations from "../hooks/useStockOperations";

interface Props {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    stockToEdit?: IStock | null;
}

interface StockFormValues {
    medicine: any;
    quantity: number;
    minStockLevel: number;
    maxStockLevel?: number;
    location?: string;
    notes?: string;
}

export const StockFormModal = ({ openModal, setOpenModal, stockToEdit }: Props) => {
    const { createStock, updateStock } = useStockOperations();

    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitting }
    } = useForm<StockFormValues>({
        defaultValues: {
            medicine: "",
            quantity: 0,
            minStockLevel: 10,
            maxStockLevel: 500,
            location: "Main Store",
            notes: ""
        }
    });

    const isEdit = Boolean(stockToEdit?._id);

    useEffect(() => {
        if (stockToEdit) {
            const medId = typeof stockToEdit.medicine === "object" ? stockToEdit.medicine?._id : stockToEdit.medicine;
            setValue("medicine", medId || "");
            setValue("quantity", stockToEdit.quantity || 0);
            setValue("minStockLevel", stockToEdit.minStockLevel || 10);
            setValue("maxStockLevel", stockToEdit.maxStockLevel || 500);
            setValue("location", stockToEdit.location || "Main Store");
            setValue("notes", stockToEdit.notes || "");
        } else {
            reset({
                medicine: "",
                quantity: 0,
                minStockLevel: 10,
                maxStockLevel: 500,
                location: "Main Store",
                notes: ""
            });
        }
    }, [stockToEdit, setValue, reset, openModal]);

    if (!openModal) return null;

    const onSubmit = async (values: StockFormValues) => {
        let success = false;
        if (isEdit && stockToEdit?._id) {
            success = !!(await updateStock({
                _id: stockToEdit._id,
                ...values
            }));
        } else {
            success = !!(await createStock(values));
        }

        if (success) {
            setOpenModal(false);
            reset();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <Boxes size={22} />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                {isEdit ? "Edit Stock Entry" : "Create Stock Record"}
                            </h3>
                            <p className="text-xs font-semibold text-slate-400">
                                {isEdit ? "Update inventory quantity and alert thresholds" : "Add or initialize inventory stock level"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {/* Medicine Selection */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Medicine Item <span className="text-rose-500">*</span>
                        </label>
                        <MedicineSelect
                            value={watch("medicine")}
                            onChange={(id, med) => setValue("medicine", med || id)}
                            disabled={isEdit}
                        />
                    </div>

                    {/* Quantity & Min Stock Level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Stock Quantity <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-400 pointer-events-none">
                                    <Hash size={16} />
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 outline-none transition-all"
                                    placeholder="0"
                                    value={watch("quantity")}
                                    onChange={(e) => setValue("quantity", Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Min Alert Level
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-400 pointer-events-none">
                                    <Hash size={16} />
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 outline-none transition-all"
                                    placeholder="10"
                                    value={watch("minStockLevel")}
                                    onChange={(e) => setValue("minStockLevel", Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Storage Location
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3 text-slate-400 pointer-events-none">
                                <MapPin size={16} />
                            </span>
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 outline-none transition-all"
                                placeholder="Main Store, Rack A, Shelf 3"
                                value={watch("location")}
                                onChange={(e) => setValue("location", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Notes / Memo
                        </label>
                        <div className="relative flex items-start">
                            <span className="absolute left-3 top-3 text-slate-400 pointer-events-none">
                                <Notebook size={16} />
                            </span>
                            <textarea
                                rows={2}
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 outline-none transition-all"
                                placeholder="Optional inventory notes..."
                                value={watch("notes")}
                                onChange={(e) => setValue("notes", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setOpenModal(false)}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-60"
                        >
                            {isEdit ? "Update Stock" : "Create Stock"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockFormModal;
