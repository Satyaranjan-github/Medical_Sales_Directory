import {
    CheckCircle2,
    ChevronLeft,
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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);

    const { data: brandsRes, isLoading } = useGetAllBrandsQuery({ page, limit });
    const [openModal, setOpenModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);

    const brands: IBrand[] = brandsRes?.data || (Array.isArray(brandsRes) ? brandsRes : []);
    const totalPages: number = brandsRes?.totalPages || brandsRes?.pagination?.totalPages || 1;
    const totalBrands: number = brandsRes?.total || brandsRes?.pagination?.total || brands.length;

    const startItem = totalBrands === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalBrands);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="p-4 sm:p-12 space-y-6 pb-28 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
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
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
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

            {/* FIXED BOTTOM PAGINATION CONTROLS (FLOATING GLASS BAR) */}
            {!isLoading && totalBrands > 0 && (
                <div className="fixed bottom-0 left-0 md:left-64 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-950/5 p-3 sm:px-6 sm:py-3.5 transition-colors duration-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
                        {/* Left Section: Total & Limit Select */}
                        <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                                <span>Showing</span>
                                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                                    {startItem}–{endItem}
                                </span>
                                <span>of</span>
                                <span className="font-bold text-slate-900 dark:text-white">{totalBrands}</span>
                                <span className="hidden sm:inline">brands</span>
                            </div>

                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                            {/* Per Page Limit Dropdown */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="hidden sm:inline font-medium">Per page:</span>
                                <select
                                    value={limit}
                                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                                    className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-semibold text-xs focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none cursor-pointer"
                                >
                                    <option value={6}>6</option>
                                    <option value={9}>9</option>
                                    <option value={12}>12</option>
                                    <option value={18}>18</option>
                                    <option value={24}>24</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Section: Pagination Controls */}
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                            {/* Prev Page */}
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                title="Previous Page"
                                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Next Page */}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                title="Next Page"
                                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
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
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-md ${brand.isDeleted ? "border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20" : "border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-600"
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
