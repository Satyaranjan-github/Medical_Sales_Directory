import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle,
    Boxes,
    Calendar,
    FileText,
    IndianRupee,
    Percent,
    Pill,
    Save,
    Tag,
    X
} from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import BrandSelect from "../../brand/components/BrandSelect";
import CategorySelect from "../../category/components/CategorySelect";
import type { IMedicine } from "../../types/medicine";
import useMedicineOperations from "../hooks/useMedicineOperations";
import { medicineSchema } from "../validation/medicineSchema";

const MedicineFormModal = ({
    setOpenModal,
    medicineData
}: {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    medicineData?: IMedicine;
}) => {
    const isUpdate = !!medicineData;

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(medicineSchema),
        mode: "onChange",
        defaultValues: {
            ...medicineData,
        }
    });

    const purchasePrice = watch("purchasePrice");
    const gstRate = watch("gst");

    // Automatically update Selling Price when Purchase Price or GST Rate changes
    useEffect(() => {
        const pPrice = Number(purchasePrice);
        const gRate = Number(gstRate);
        if (!isNaN(pPrice) && pPrice > 0 && !isNaN(gRate) && gRate > 0) {
            const calculatedSellingPrice = Number((pPrice * (1 + gRate / 100)).toFixed(2));
            setValue("sellingPrice", calculatedSellingPrice, { shouldValidate: true });
        }
    }, [purchasePrice, gstRate, setValue]);

    const { createMedicine, updateMedicine } = useMedicineOperations();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        const payload = {
            ...data,
            gst: data.gst ? Number(data.gst) : undefined
        };
        if (isUpdate) {
            await updateMedicine(payload as unknown as IMedicine);
        } else {
            await createMedicine(payload as unknown as IMedicine);
        }
        setOpenModal(false);
    };

    useEffect(() => {
        if (!medicineData) return;
        reset({
            ...medicineData,
            expiry: medicineData.expiry ? new Date(medicineData.expiry) : new Date()
        });
    }, [medicineData, reset]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
            {/* MODAL DIALOG CONTAINER */}
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 transition-all duration-300 animate-in zoom-in-95 duration-200">
                
                {/* 1. HEADER (FIXED/STICKY NAVBAR STYLE) */}
                <header className="p-4 sm:p-5.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-xs transition-colors duration-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <Pill size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                {isUpdate ? "Update Medicine" : "Add New Medicine"}
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                {isUpdate ? "Modify product stock & details" : "Register a new drug into directory stock"}
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
                    <form id="medicine-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {/* SECTION 1: GENERAL INFORMATION */}
                        <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <Pill size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                    Product Identification
                                </h4>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
                                    Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Pill size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="name"
                                        {...register("name")}
                                        placeholder="e.g. Amoxicillin 500mg Capsule"
                                        className={`w-full text-sm font-semibold pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${errors.name
                                            ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:border-rose-500"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                            }`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1.5 font-bold">
                                        <AlertCircle size={12} />
                                        {errors.name.message as string}
                                    </p>
                                )}
                            </div>

                            {/* Brand & Category Selectors */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="brand">
                                        Brand
                                    </label>
                                    <BrandSelect name="brand" control={control} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="category">
                                        Category
                                    </label>
                                    <CategorySelect name="category" control={control} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: FINANCIAL & TAX CALCULATIONS */}
                        <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/40 dark:border-emerald-900/40">
                                <div className="flex items-center gap-2">
                                    <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                        Pricing & Tax Structure
                                    </h4>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Purchase Price */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="purchasePrice">
                                        Purchase Price (₹)
                                    </label>
                                    <div className="relative">
                                        <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="purchasePrice"
                                            type="number"
                                            step="0.01"
                                            {...register("purchasePrice", { valueAsNumber: true })}
                                            placeholder="0.00"
                                            className="w-full text-sm font-semibold pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>

                                {/* GST */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="gst">
                                        GST (%)
                                    </label>
                                    <div className="relative">
                                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                                        <select
                                            id="gst"
                                            {...register("gst", { valueAsNumber: true })}
                                            className={`w-full text-sm font-semibold pl-8 pr-3 py-2.5 rounded-xl border outline-none transition-all cursor-pointer ${errors.gst
                                                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500"
                                                }`}
                                        >
                                            <option value="">Select GST</option>
                                            <option value={5}>5%</option>
                                            <option value={12}>12%</option>
                                            <option value={18}>18%</option>
                                            <option value={28}>28%</option>
                                        </select>
                                    </div>
                                    {errors.gst && (
                                        <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1 font-bold">
                                            <AlertCircle size={12} />
                                            {errors.gst.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Selling Price */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="sellingPrice">
                                            Selling Price (₹) <span className="text-rose-500">*</span>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
                                        <input
                                            id="sellingPrice"
                                            type="number"
                                            step="0.01"
                                            {...register("sellingPrice", { valueAsNumber: true })}
                                            placeholder="0.00"
                                            className="w-full text-sm font-extrabold text-emerald-700 dark:text-emerald-300 pl-9 pr-3 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: INVENTORY & EXPIRY LOGISTICS */}
                        <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <Boxes size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                    Inventory & Batch Control
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Stock */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="stock">
                                        Stock
                                    </label>
                                    <div className="relative">
                                        <Boxes size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="stock"
                                            type="number"
                                            {...register("stock", { valueAsNumber: true })}
                                            placeholder="100"
                                            className="w-full text-sm font-semibold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Batch Number */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="batchNumber">
                                        Batch Number
                                    </label>
                                    <div className="relative">
                                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="batchNumber"
                                            {...register("batchNumber")}
                                            placeholder="e.g. B-9021"
                                            className="w-full text-sm font-semibold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="expiry">
                                        Expiry Date
                                    </label>
                                    <div className="relative">
                                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                                        <Controller
                                            name="expiry"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    id="expiry"
                                                    type="date"
                                                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                                    className="w-full text-sm font-semibold pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: DESCRIPTION */}
                        <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <FileText size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                    Description
                                </h4>
                            </div>
                            <textarea
                                id="description"
                                rows={3}
                                {...register("description")}
                                placeholder="Enter chemical composition, dosage instructions, or storage conditions..."
                                className="w-full text-sm font-semibold p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                            />
                        </div>
                    </form>
                </main>

                {/* 3. FOOTER (FIXED/STICKY NAVBAR STYLE) */}
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
                        form="medicine-form"
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                        <Save size={18} />
                        {isUpdate ? "Save Medicine Record" : "Create Medicine Entry"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MedicineFormModal;
