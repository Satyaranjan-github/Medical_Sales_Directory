import { format } from "date-fns"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ICategory } from "../../types/category"
import { useGetAllCategoriesQuery } from "../api/categoryApi"
import CategoryFormModal from "./CategoryFormModal"
import CategorySearch from "./CategorySearch"

const CategoryLists = () => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery(undefined)
    const [openModal, setOpenModal] = useState(false)
    const [openSearchModal, setOpenSearchModal] = useState(false)

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-all"
                >
                    <Plus size={18} />
                    Add Categories
                </button>

                <button
                    onClick={() => setOpenSearchModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-600 font-medium shadow-sm hover:shadow-md hover:bg-slate-100 transition-all"
                >
                    <Search size={18} />
                    Search Categories
                </button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {categories?.data?.map((category: ICategory) => (
                    <CategoryCard key={category._id} category={category} />
                ))}
            </div>
            {openModal && (<CategoryFormModal setOpenModal={setOpenModal} />)}
            {openSearchModal && (<CategorySearch setOpenSearchModal={setOpenSearchModal} />)}
        </div>
    )
}

export default CategoryLists

export const CategoryCard = ({ category }: { category: ICategory }) => {
    const navigate = useNavigate()

    return (
        <div className="p-5 sm:p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white" onClick={() => navigate(`/categories/${category._id}`)}>
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