import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ICategory } from "../../types/category"
import { useGetAllCategorysQuery } from "../api/categoryApi"
import CategoryFormModal from "./CategoryFormModal"

const CategoryLists = () => {
    const { data: categorys, isLoading } = useGetAllCategorysQuery(undefined)
    const [openModal, setOpenModal] = useState(false)

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className="p-4 sm:p-6">
            <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-3 px-5 py-3 rounded-lg border border-gray-500 shadow-sm"
            >
                <Plus size={20} className="text-green-600" />
                <span className="text-lg font-medium text-green-600">Add Category</span>
            </button>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {categorys?.data?.map((category: ICategory) => (
                    <CategoryCard key={category._id} category={category} />
                ))}
            </div>
            {openModal && (<CategoryFormModal setOpenModal={setOpenModal} />)}
        </div>
    )
}

export default CategoryLists


export const CategoryCard = ({ category }: { category: ICategory }) => {
    const navigate = useNavigate()

    return (
        <div className="p-5 sm:p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white mt-4 sm:mt-6" onClick={() => navigate(`/categories/${category._id}`)}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {category.name}
            </h3>
            <div className="border-t border-slate-100 mb-4"></div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Created
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                        {category.createdAt && format(category.createdAt, "dd MMM yyyy")}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Updated
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                        {category.updatedAt && format(category.updatedAt, "dd MMM yyyy")}
                    </span>
                </div>
            </div>
        </div>
    )
}