import { Eye, Pencil, Trash, Undo } from "lucide-react"
import { useState } from "react"
import type { IBrand } from "../../types/brand"
import useBrandOperations from "../hooks/useBrandOperations"
import BrandFormModal from "./BrandFormModal"

const BrandActionButtons = ({ brandData }: { brandData: IBrand }) => {
    const [open, setOpen] = useState(false)
    const { deleteBrand, restoreBrand } = useBrandOperations()

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
                {!brandData.isDeleted && (
                    <>
                        <div className="flex items-center justify-center gap-2 text-bold rounded-lg border border-gray-500 p-2 cursor-pointer">
                            <Pencil className="size-5 min-w-fit " />
                            <button onClick={() => { setOpen(true) }}>
                                <p className="text-sm font-semibold">
                                    Update Brand
                                </p>
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-bold rounded-lg border border-gray-500 p-2 cursor-pointer">
                            <Trash className="size-5 min-w-fit" />
                            <button onClick={() => deleteBrand(brandData._id as string)}>
                                <p className="text-sm font-semibold">
                                    Delete Brand
                                </p>
                            </button>
                        </div>
                    </>
                )}
                {brandData.isDeleted && (
                    <div className="flex items-center justify-center gap-2 text-bold rounded-lg border border-gray-500 p-2 cursor-pointer">
                        <Undo className="size-5 min-w-fit" />
                        <button onClick={() => restoreBrand(brandData._id as string)}>
                            <p className="text-sm font-semibold">
                                Restore Brand
                            </p>
                        </button>
                    </div>
                )}
            </div>
            {
                open && (
                    <BrandFormModal
                        brandData={brandData}
                        setOpenModal={setOpen}
                    />
                )
            }
        </section >
    )
}

export default BrandActionButtons
