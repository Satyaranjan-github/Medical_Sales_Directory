import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllMedicinesQuery } from "../api/medicineApi";
import type { IMedicine } from "../types/medicine";
import MedicineForm from "./MedicineForm";

const MedicineLists = () => {
    const navigate = useNavigate()
    const { data: medicines, isLoading } = useGetAllMedicinesQuery(undefined)
    const [openModal, setOpenModal] = useState(false)

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className="p-4 space-y-2">
            <button className="flex justify-center items-center gap-2 p-4 bg-white border border-slate-200 shadow-sm rounded-xl"
                onClick={() => setOpenModal(true)}
            >
                <Plus size={24} />
                <p className="text-slate-500 text-2xl">Add medicines</p>
            </button>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {medicines?.data?.map((med: IMedicine) => (
                    <div
                        key={med._id}
                        className={`p-5 border border-slate-200 shadow-sm rounded-xl cursor-pointer ${med.isDeleted ? "bg-red-500" : "bg-white "}`}
                        onClick={() => navigate(`/medicines/${med._id}`)}
                    >
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-800 leading-tight">
                                    {med.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    ₹{med.cost}
                                </span>
                                {med.discount > 0 && (
                                    <p className="text-[10px] text-green-600 font-bold mt-1">
                                        {med.discount}% OFF
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Data Grid Section */}
                        <div className="grid grid-cols-2 gap-y-3 border-t border-slate-50 pt-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Expiry Date</span>
                                <span className="text-sm font-semibold text-slate-700">
                                    {new Date(med.expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>

                            <div className="flex flex-col col-span-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Entry Date</span>
                                <span className="text-xs text-slate-500">
                                    Registered on {med.createdAt ? new Date(med.createdAt).toLocaleString() : "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {
                openModal && (
                    <MedicineForm setOpenModal={setOpenModal} />
                )
            }
        </div >
    )
}

export default MedicineLists
