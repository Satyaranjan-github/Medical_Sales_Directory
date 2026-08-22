import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type { ICategory } from "../../types/category";
import useCategoryOperations from "../hooks/useCategoryOperations";
import { categorySchema } from "../validation/categorySchema";

const CategoryFormModal = ({
    setOpenModal,
    categoryData }:
    {
        setOpenModal: Dispatch<SetStateAction<boolean>>,
        categoryData?: ICategory
    }) => {
    const isUpdate = !!categoryData
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } =
        useForm<ICategory>({
            resolver: zodResolver(categorySchema),
            mode: "onChange",
            defaultValues: categoryData
        });
    const { createCategory, updateCategory } = useCategoryOperations()

    const onSubmit = async (data: ICategory) => {

        if (isUpdate) {
            await updateCategory(data)
        } else {
            await createCategory(data)
            setOpenModal(false)
        }
        setOpenModal(false)
    }

    useEffect(() => {
        if (!categoryData) return

        reset({
            ...categoryData,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <form className="p-4 sm:p-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800">{isUpdate ? "Update" : "Add"} Category</h3>
                        <button onClick={() => setOpenModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1"
                                htmlFor="name"
                            >Category Name</label>
                            <input
                                {...register("name")}
                                placeholder="Enter category name"
                                className="w-full border rounded-lg p-2"
                            />
                            {errors.name &&
                                <span className="text-xs text-red-500">{errors.name.message}</span>
                            }
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1"
                                htmlFor="description"
                            >Description</label>
                            <input
                                {...register("description")}
                                placeholder="Enter description"
                                className="w-full border rounded-lg p-2"
                            />
                            {errors.description &&
                                <span className="text-xs text-red-500">{errors.description.message}</span>
                            }
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="mr-2"
                            />
                            Is Active
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="p-6 bg-slate-50 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setOpenModal(false)}
                            className="flex-1 font-bold text-slate-600 border py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer">
                            <Save size={18} />
                            {isUpdate ? "Update" : "Add"} Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CategoryFormModal
