import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, FileText, Layers, Save, X } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type { ICategory } from "../../types/category";
import useCategoryOperations from "../hooks/useCategoryOperations";
import { categorySchema } from "../validation/categorySchema";

const CategoryFormModal = ({
    setOpenModal,
    categoryData
}: {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    categoryData?: ICategory;
}) => {
    const isUpdate = !!categoryData;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(categorySchema),
        mode: "onChange",
        defaultValues: {
            isActive: true,
            ...categoryData
        }
    });

    const { createCategory, updateCategory } = useCategoryOperations();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        if (isUpdate) {
            await updateCategory(data as ICategory);
        } else {
            await createCategory(data as ICategory);
        }
        setOpenModal(false);
    };

    useEffect(() => {
        if (!categoryData) return;
        reset({
            ...categoryData
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <Layers size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                {isUpdate ? "Update Category" : "Add New Category"}
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                {isUpdate ? "Modify category details" : "Create a new medicine category"}
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
                        {/* Category Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("name")}
                                placeholder="e.g. Antibiotics, Analgesics, Cardiology"
                                className={`w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                                    errors.name
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

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                {...register("description")}
                                placeholder="Enter details about this medicine classification..."
                                className="w-full text-sm font-semibold p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                            />
                        </div>

                        {/* Active Status Checkbox */}
                        <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <FileText size={18} className="text-slate-500 dark:text-slate-400" />
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Status</p>
                                    <p className="text-[10px] text-slate-400">Available for medicine categorization</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="w-5 h-5 accent-green-600 rounded border-slate-300 focus:ring-2 focus:ring-green-500 cursor-pointer"
                            />
                        </label>
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
                            {isUpdate ? "Save Category" : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;
