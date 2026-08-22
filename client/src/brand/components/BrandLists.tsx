import {
    CheckCircle2,
    ChevronRight,
    Clock,
    Plus,
    Search,
    Tag,
    XCircle
} from "lucide-react";
import { useState } from "react";
import { useGetAllBrandsQuery } from "../api/brandApi";
import BrandFormModal from "./BrandFormModal";
import BrandSearch from "./BrandSearch";
import { format } from "date-fns";
import type { IBrand } from "../../types/brand";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../common/LoadingModal";

const BrandLists = () => {
    const { data: brandsRes, isLoading } = useGetAllBrandsQuery(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);

    const brands: IBrand[] = brandsRes?.data || [];

    return (
        <div className="p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <Tag size={20} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Brand Directory
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage pharmaceutical manufacturers, brand labels, and supplier lines.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm shadow-md hover:bg-green-700 transition-all cursor-pointer"
                    >
                        <Plus size={18} />
                        Add Brand
                    </button>

                    <button
                        onClick={() => setOpenSearchModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        <Search size={18} />
                        Search Brands
                    </button>
                </div>
            </div>

            {/* LOADING STATE */}
            {isLoading && <LoadingModal />}

            {/* BRANDS GRID */}
            {!isLoading && brands.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {brands.map((brand: IBrand) => (
                        <BrandCard key={brand._id} brand={brand} />
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && brands.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                        <Tag size={28} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Brands Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Start by registering your first pharmaceutical manufacturer or brand label.
                    </p>
                </div>
            )}

            {/* Modals */}
            {openModal && <BrandFormModal setOpenModal={setOpenModal} />}
            {openSearchModal && <BrandSearch setOpenSearchModal={setOpenSearchModal} />}
        </div>
    );
};

export default BrandLists;

// Individual Brand Card
export const BrandCard = ({ brand, onSelect }: { brand: IBrand; onSelect?: () => void }) => {
    const navigate = useNavigate();
    const handleCardClick = onSelect || (() => navigate(`/brands/${brand._id}`));

    return (
        <div
            onClick={handleCardClick}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-md ${
                brand.isDeleted ? "border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20" : "border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-600"
            }`}
        >
            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-green-100 dark:group-hover:bg-green-950 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                            <Tag size={16} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug">
                            {brand.name}
                        </h3>
                    </div>

                    {brand.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                            <CheckCircle2 size={10} />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            <XCircle size={10} />
                            Inactive
                        </span>
                    )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px] mb-3">
                    {brand.description || "No description provided."}
                </p>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-3" />

                {/* Dates Breakdown */}
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                            <Clock size={12} />
                            Created
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {brand.createdAt ? format(new Date(brand.createdAt), "dd MMM yyyy") : "-"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                            <Clock size={12} />
                            Updated
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {brand.updatedAt ? format(new Date(brand.updatedAt), "dd MMM yyyy") : "-"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Quick Action */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-green-600 dark:text-green-400">
                <span>View Details</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>

            {brand.isDeleted && (
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Archived
                </span>
            )}
        </div>
    );
};
