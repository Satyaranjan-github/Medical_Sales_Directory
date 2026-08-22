import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Boxes, Calendar, IndianRupee, Percent, Pill, Save, Tag, X } from "lucide-react";
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
        formState: { errors }
    } = useForm({
        resolver: zodResolver(medicineSchema),
        mode: "onChange",
        defaultValues: {
            ...medicineData,
            expiry: medicineData?.expiry ? new Date(medicineData.expiry) : new Date()
        }
    });

    const { createMedicine, updateMedicine } = useMedicineOperations();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        if (isUpdate) {
            await updateMedicine(data as unknown as IMedicine);
        } else {
            await createMedicine(data as unknown as IMedicine);
        }
        setOpenModal(false);
    };

    useEffect(() => {
        if (!medicineData) return;
        reset({
            ...medicineData,
            expiry: medicineData.expiry ? new Date(medicineData.expiry) : new Date()
        });
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
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
                </div>

                {/* Form Content */}
                <form className="flex-1 overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-5">
                        {/* Medicine Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
                                Medicine Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("name")}
                                placeholder="e.g. Paracetamol 500mg"
                                className={`w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border outline-none transition-all ${errors.name
                                    ? "border-red-300 bg-red-50/20 focus:border-red-500"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    }`}
                            />
                            {errors.name && (
                                <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1 font-medium">
                                    <AlertCircle size={12} />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Brand & Category Selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="brand">
                                    Brand Manufacturer
                                </label>
                                <BrandSelect
                                    name="brand"
                                    control={control}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="category">
                                    Category Classification
                                </label>
                                <CategorySelect
                                    name="category"
                                    control={control}
                                />
                            </div>
                        </div>

                        {/* Pricing (Purchase & Selling) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Purchase Price (₹)
                                </label>
                                <div className="relative">
                                    <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("purchasePrice", { valueAsNumber: true })}
                                        placeholder="0.00"
                                        className="w-full text-sm font-semibold pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Selling Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("sellingPrice", { valueAsNumber: true })}
                                        placeholder="0.00"
                                        className="w-full text-sm font-semibold pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* GST, Stock, Batch Number */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    GST Rate (%)
                                </label>
                                <div className="relative">
                                    <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        {...register("gst", { valueAsNumber: true })}
                                        placeholder="18"
                                        className="w-full text-sm font-semibold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Stock Quantity
                                </label>
                                <div className="relative">
                                    <Boxes size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        {...register("stock", { valueAsNumber: true })}
                                        placeholder="100"
                                        className="w-full text-sm font-semibold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Batch No.
                                </label>
                                <div className="relative">
                                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        {...register("batchNumber")}
                                        placeholder="B-9021"
                                        className="w-full text-sm font-semibold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Expiry Date
                            </label>
                            <div className="relative">
                                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Controller
                                    name="expiry"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="date"
                                            value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                            className="w-full text-sm font-semibold pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600 cursor-pointer"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">
                                Description & Usage Directions
                            </label>
                            <textarea
                                rows={3}
                                {...register("description")}
                                placeholder="Enter usage instructions, dosage notes, or active chemical ingredients..."
                                className="w-full text-sm font-semibold p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 sticky bottom-0 z-10">
                        <button
                            type="button"
                            onClick={() => setOpenModal(false)}
                            className="flex-1 py-3 px-4 font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <Save size={18} />
                            {isUpdate ? "Save Medicine" : "Create Medicine"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicineFormModal;
