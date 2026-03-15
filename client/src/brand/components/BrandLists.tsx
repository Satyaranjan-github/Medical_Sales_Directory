import { Plus } from "lucide-react"
import { useState } from "react"
import { useGetAllBrandsQuery } from "../api/brandApi"
import BrandFormModal from "./BrandFormModal"

const BrandLists = () => {
    const { data: brands, isLoading } = useGetAllBrandsQuery(undefined)
    const [openModal, setOpenModal] = useState(false)

    console.log(brands)

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
                <span className="text-lg font-medium text-green-600">Add Brands</span>
            </button>
            {openModal && (<BrandFormModal setOpenModal={setOpenModal} />)}
        </div>
    )
}

export default BrandLists
