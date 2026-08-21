import { format } from "date-fns"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { IBrand } from "../../types/brand"
import { useGetAllBrandsQuery } from "../api/brandApi"
import BrandFormModal from "./BrandFormModal"
import BrandSearch from "./BrandSearch"

const BrandLists = () => {
    const { data: brands, isLoading } = useGetAllBrandsQuery(undefined)
    const [openModal, setOpenModal] = useState(false)
    const [openSearchModal, setOpenSearchModal] = useState(false)

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">

            {/* Top Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-all"
                >
                    <Plus size={18} />
                    Add Brands
                </button>

                <button
                    onClick={() => setOpenSearchModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-600 font-medium shadow-sm hover:shadow-md hover:bg-slate-100 transition-all"
                >
                    <Search size={18} />
                    Search Brands
                </button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {brands?.data?.map((brand: IBrand) => (
                    <BrandCard key={brand._id} brand={brand} />
                ))}
            </div>
            {openModal && (<BrandFormModal setOpenModal={setOpenModal} />)}
            {openSearchModal && (<BrandSearch setOpenSearchModal={setOpenSearchModal} />)}
        </div>
    )
}

export default BrandLists


export const BrandCard = ({ brand }: { brand: IBrand }) => {
    const navigate = useNavigate()

    return (
        <div className="p-5 sm:p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white" onClick={() => navigate(`/brands/${brand._id}`)}>
            <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-green-600 transition">
                {brand.name}
            </h3>
            <div className="border-t border-slate-100 mb-4"></div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Created
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                        {brand.createdAt && format(brand.createdAt, "dd MMM yyyy")}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Updated
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                        {brand.updatedAt && format(brand.updatedAt, "dd MMM yyyy")}
                    </span>
                </div>
            </div>
        </div>
    )
}