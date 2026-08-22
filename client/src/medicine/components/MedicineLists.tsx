import {
    Boxes,
    ChevronRight,
    Clock,
    Pill,
    Plus,
    Search,
    Tag,
    Layers
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IBrand } from "../../types/brand";
import type { ICategory } from "../../types/category";
import type { IMedicine } from "../../types/medicine";
import { useGetAllMedicinesQuery } from "../api/medicineApi";
import MedicineFormModal from "./MedicineFormModal";
import MedicineSearch from "./MedicineSearch";
import LoadingModal from "../../common/LoadingModal";

const MedicineLists = () => {
    const navigate = useNavigate();
    const { data: medicinesRes, isLoading } = useGetAllMedicinesQuery(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);

    const rawMedicines: IMedicine[] = medicinesRes?.data || [];

    return (
        <div className="p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <Pill size={20} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Medicine Directory
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Browse and manage your complete pharmaceutical catalog & stock inventory.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm shadow-md hover:bg-green-700 transition-all cursor-pointer"
                    >
                        <Plus size={18} />
                        Add Medicine
                    </button>

                    <button
                        onClick={() => setOpenSearchModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        <Search size={18} />
                        Quick Search
                    </button>
                </div>
            </div>

            {/* LOADING STATE */}
            {isLoading && <LoadingModal />}

            {/* MEDICINES GRID */}
            {!isLoading && rawMedicines.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {rawMedicines.map((med) => (
                        <MedicineCard
                            key={med._id}
                            med={med}
                            onSelect={() => navigate(`/medicines/${med._id}`)}
                        />
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && rawMedicines.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                        <Pill size={28} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Medicines Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Get started by adding your first pharmaceutical product to the inventory.
                    </p>
                </div>
            )}

            {/* Modals */}
            {openModal && <MedicineFormModal setOpenModal={setOpenModal} />}
            {openSearchModal && <MedicineSearch setOpenSearchModal={setOpenSearchModal} />}
        </div>
    );
};

export default MedicineLists;

// Individual Medicine Card Component
const MedicineCard = ({ med, onSelect }: { med: IMedicine; onSelect: () => void }) => {
    const brandName = typeof med.brand === "object" ? (med.brand as IBrand)?.name : "";
    const categoryName = typeof med.category === "object" ? (med.category as ICategory)?.name : "";

    const isLow = (med.stock ?? 0) <= 10;
    const isExpired = med.expiry && new Date(med.expiry) <= new Date();

    return (
        <div
            onClick={onSelect}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-md ${
                med.isDeleted ? "border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20" : "border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-600"
            }`}
        >
            <div>
                {/* Header Title & Price */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug">
                            {med.name}
                        </h3>
                        {med.batchNumber && (
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
                                BATCH: {med.batchNumber}
                            </span>
                        )}
                    </div>

                    {med.sellingPrice !== undefined && (
                        <span className="text-sm font-extrabold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 px-2.5 py-1 rounded-lg border border-green-200/60 dark:border-green-800/60 shrink-0">
                            ₹{med.sellingPrice}
                        </span>
                    )}
                </div>

                {/* Tags (Brand & Category) */}
                <div className="flex flex-wrap gap-1.5 my-3">
                    {brandName && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            <Tag size={10} />
                            {brandName}
                        </span>
                    )}
                    {categoryName && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800">
                            <Layers size={10} />
                            {categoryName}
                        </span>
                    )}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-3" />

                {/* Details Breakdown */}
                <div className="space-y-2 text-xs">
                    {/* Stock Status */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <Boxes size={12} />
                            Stock
                        </span>
                        <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                isLow ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}
                        >
                            {med.stock ?? 0} units
                        </span>
                    </div>

                    {/* Expiry Date */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <Clock size={12} />
                            Expiry
                        </span>
                        <span className={`font-semibold ${isExpired ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300"}`}>
                            {med.expiry
                                ? new Date(med.expiry).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric"
                                  })
                                : "-"}
                        </span>
                    </div>

                    {/* Purchase Price vs GST */}
                    {med.purchasePrice !== undefined && (
                        <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                            <span>Cost: ₹{med.purchasePrice}</span>
                            <span>GST: {med.gst}%</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Quick Action Prompt */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-green-600 dark:text-green-400">
                <span>View Details</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>

            {med.isDeleted && (
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Archived
                </span>
            )}
        </div>
    );
};
