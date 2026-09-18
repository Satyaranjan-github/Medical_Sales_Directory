import { ChevronRight, Layers, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import type { ICategory } from "../../types/category";
import { useLazyGetCategorySuggestionsQuery } from "../api/categoryApi";

const CategorySearch = ({
    setOpenSearchModal
}: {
    setOpenSearchModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const [query, setQuery] = useState("");
    const [trigger, { data, isFetching, isLoading }] = useLazyGetCategorySuggestionsQuery();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpenSearchModal(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setOpenSearchModal]);

    // Debounced suggestion query trigger
    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim()) {
                trigger(query.trim());
            }
        }, 350);
        return () => clearTimeout(delay);
    }, [query, trigger]);

    const results: ICategory[] = data?.data || [];
    const isSearching = isLoading || isFetching;

    const handleSelectCategory = (categoryId: string) => {
        navigate(`/categories/${categoryId}`);
        setOpenSearchModal(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 pt-16 sm:pt-4 animate-in fade-in duration-150"
            onClick={() => setOpenSearchModal(false)}
        >
            <div
                className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input Bar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-white sticky top-0 z-10">
                    <div className="p-2 rounded-xl bg-green-50 text-green-600 shrink-0">
                        {isSearching ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Search size={20} />
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search categories by classification or therapeutic name..."
                        className="w-full text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-400 select-none">
                        ESC
                    </kbd>
                </div>

                {/* Content Body */}
                <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-2">
                    {/* Idle State */}
                    {!query.trim() && (
                        <div className="py-8 px-4 text-center space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                                <Layers size={22} />
                            </div>
                            <p className="text-xs font-bold text-slate-700">Quick Category Search</p>
                            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                                Type a category or classification name above to quickly locate and view its detail page.
                            </p>
                        </div>
                    )}

                    {/* Searching Indicator */}
                    {query.trim() && isSearching && results.length === 0 && (
                        <div className="py-8 text-center text-xs font-semibold text-slate-400 animate-pulse">
                            Searching category database...
                        </div>
                    )}

                    {/* Empty Results State */}
                    {query.trim() && !isSearching && results.length === 0 && (
                        <div className="py-8 px-4 text-center space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                                <Search size={22} />
                            </div>
                            <p className="text-xs font-bold text-slate-800">No Categories Found</p>
                            <p className="text-[11px] text-slate-400">
                                No category matches <span className="font-bold text-slate-600">"{query}"</span>. Try searching with a different keyword.
                            </p>
                        </div>
                    )}

                    {/* Results List */}
                    {results.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                                Matching Categories ({results.length})
                            </p>
                            <div className="space-y-1">
                                {results.map((category) => (
                                    <div
                                        key={category._id}
                                        onClick={() => handleSelectCategory(category._id as string)}
                                        className="group p-3 rounded-2xl border border-transparent hover:border-green-200 bg-slate-50/60 hover:bg-green-50/60 transition-all cursor-pointer flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 rounded-xl bg-white text-green-600 border border-slate-100 group-hover:border-green-200 shadow-xs shrink-0 transition-colors">
                                                <Layers size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-green-700 transition-colors truncate">
                                                        {category.name}
                                                    </h4>
                                                    {category.isActive !== false ? (
                                                        <span className="px-2 py-0.5 rounded-full bg-green-100/80 text-green-700 text-[10px] font-bold">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-500 text-[10px] font-bold">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                    {category.description || "No description provided"}
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Tip */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>Click any item to view details</span>
                    <button
                        type="button"
                        onClick={() => setOpenSearchModal(false)}
                        className="text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategorySearch;
