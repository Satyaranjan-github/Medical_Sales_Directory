import { format } from "date-fns";
import {
    CheckCircle2,
    ChevronRight,
    Clock,
    Layers,
    Plus,
    Search,
    XCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ICategory } from "../../types/category";
import { useGetAllCategoriesQuery } from "../api/categoryApi";
import CategoryFormModal from "./CategoryFormModal";
import CategorySearch from "./CategorySearch";
import LoadingModal from "../../common/LoadingModal";

const CategoryLists = () => {
    const { data: categoriesRes, isLoading } = useGetAllCategoriesQuery(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);

    const categories: ICategory[] = categoriesRes?.data || [];

    return (
        <div className="p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <Layers size={20} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Category Directory
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Organize medicine categories, therapeutic classifications, and drug families.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm shadow-md hover:bg-green-700 transition-all cursor-pointer"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>

                    <button
                        onClick={() => setOpenSearchModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        <Search size={18} />
                        Search Categories
                    </button>
                </div>
            </div>

            {/* LOADING STATE */}
            {isLoading && <LoadingModal />}

            {/* CATEGORIES GRID */}
            {!isLoading && categories.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category: ICategory) => (
                        <CategoryCard key={category._id} category={category} />
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && categories.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                        <Layers size={28} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Categories Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Start by creating your first medicine category or therapeutic classification.
                    </p>
                </div>
            )}

            {/* Modals */}
            {openModal && <CategoryFormModal setOpenModal={setOpenModal} />}
            {openSearchModal && <CategorySearch setOpenSearchModal={setOpenSearchModal} />}
        </div>
    );
};

export default CategoryLists;

// Individual Category Card
export const CategoryCard = ({ category, onSelect }: { category: ICategory; onSelect?: () => void }) => {
    const navigate = useNavigate();
    const handleCardClick = onSelect || (() => navigate(`/categories/${category._id}`));

    return (
        <div
            onClick={handleCardClick}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-md ${
                category.isDeleted ? "border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20" : "border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-600"
            }`}
        >
            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-green-100 dark:group-hover:bg-green-950 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                            <Layers size={16} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug">
                            {category.name}
                        </h3>
                    </div>

                    {category.isActive !== false ? (
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
                    {category.description || "No description provided."}
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
                            {category.createdAt ? format(new Date(category.createdAt), "dd MMM yyyy") : "-"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                            <Clock size={12} />
                            Updated
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {category.updatedAt ? format(new Date(category.updatedAt), "dd MMM yyyy") : "-"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Quick Action */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-green-600 dark:text-green-400">
                <span>View Details</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>

            {category.isDeleted && (
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Archived
                </span>
            )}
        </div>
    );
};
