import { Eye, Pencil, Trash, Undo } from "lucide-react"
import { useState } from "react"
import type { ICategory } from "../../types/category"
import useCategoryOperations from "../hooks/useCategoryOperations"
import CategoryFormModal from "./CategoryFormModal"

const CategoryActionButtons = ({ categoryData }: { categoryData: ICategory }) => {
    const [open, setOpen] = useState(false)
    const { deleteCategory, restoreCategory } = useCategoryOperations()

    return (
        <section className="rounded-lg border p-4 sm:p-6 border-gray-400">
            { /* Header Section */}
            <div className="flex gap-2 items-start mb-4 font-extrabold">
                <Eye size={24} className="text-green-600" />
                <h3 className="text-xl font-extrabold leading-tight text-green-600">
                    Action Buttons
                </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {!categoryData.isDeleted && (
                    <>
                        <div className="flex items-center justify-center gap-2 text-bold rounded-lg border border-gray-500 p-2 cursor-pointer">
                            <Pencil className="size-5 min-w-fit " />
                            <button onClick={() => { setOpen(true) }}>
                                <p className="text-sm font-semibold">
                                    Update Category
                                </p>
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-bold rounded-lg border border-gray-500 p-2 cursor-pointer">
                            <Trash className="size-5 min-w-fit" />
                            <button onClick={() => deleteCategory(categoryData._id as string)}>
                                <p className="text-sm font-semibold">
                                    Delete Category
                                </p>
                            </button>
                        </div>
                    </>
                )}
                {categoryData.isDeleted && (
                    <div className="flex items-center justify-center gap-2 text-bold rounded-lg border border-gray-500 p-2 cursor-pointer">
                        <Undo className="size-5 min-w-fit" />
                        <button onClick={() => restoreCategory(categoryData._id as string)}>
                            <p className="text-sm font-semibold">
                                Restore Category
                            </p>
                        </button>
                    </div>
                )}
            </div>
            {
                open && (
                    <CategoryFormModal
                        categoryData={categoryData}
                        setOpenModal={setOpen}
                    />
                )
            }
        </section >
    )
}

export default CategoryActionButtons
