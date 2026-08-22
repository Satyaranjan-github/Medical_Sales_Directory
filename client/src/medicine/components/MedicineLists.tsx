import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IMedicine } from "../../types/medicine";
import { useGetAllMedicinesQuery } from "../api/medicineApi";
import MedicineFormModal from "./MedicineFormModal";
import MedicineSearch from "./MedicineSearch";

const MedicineLists = () => {
    const navigate = useNavigate()
    const { data: medicines, isLoading } = useGetAllMedicinesQuery(undefined)
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
                    Add Medicines
                </button>

                <button
                    onClick={() => setOpenSearchModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-600 font-medium shadow-sm hover:shadow-md hover:bg-slate-100 transition-all"
                >
                    <Search size={18} />
                    Search Medicines
                </button>
            </div>

            {/* Medicines Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {medicines?.data?.map((med: IMedicine) => (
                    <div
                        key={med._id}
                        onClick={() => navigate(`/medicines/${med._id}`)}
                        className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer
                ${med.isDeleted
                                ? "bg-red-50 border-red-200"
                                : "bg-white border-slate-200"
                            }`}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start gap-3 mb-4">
                            <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-green-600 transition">
                                {med.name}
                            </h3>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                                    ₹{med.cost}
                                </span>
                                {med.discount > 0 && (
                                    <span className="text-[10px] text-green-600 font-bold mt-1">
                                        {med.discount}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-100 mb-4" />

                        {/* Details */}
                        <div className="space-y-3">
                            {/* Expiry */}
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                    Expiry Date
                                </span>
                                <span className="text-sm font-semibold text-slate-700">
                                    {new Date(med.expiry).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>

                            {/* Created */}
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                                    Created
                                </span>
                                <span className="text-xs text-slate-500">
                                    {med.createdAt
                                        ? new Date(med.createdAt).toLocaleDateString()
                                        : "-"}
                                </span>
                            </div>
                        </div>

                        {/* Subtle Hover Accent */}
                        <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-green-100 pointer-events-none" />

                        {/* Deleted Badge */}
                        {med.isDeleted && (
                            <span className="absolute top-2 right-2 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                                Deleted
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Modals */}
            {
                openModal && (
                    <MedicineFormModal setOpenModal={setOpenModal} />
                )
            }

            {
                openSearchModal && (
                    <MedicineSearch setOpenSearchModal={setOpenSearchModal} />
                )
            }
        </div >
    )
}

export default MedicineLists
