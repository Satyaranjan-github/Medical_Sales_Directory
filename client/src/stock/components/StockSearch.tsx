import { ChevronRight, Loader2, Boxes, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useLazyGetStockSuggestionsQuery } from "../api/stockApi";

export const StockSearch = ({
    setOpenSearchModal
}: {
    setOpenSearchModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const [query, setQuery] = useState("");
    const [trigger, { data, isFetching, isLoading }] = useLazyGetStockSuggestionsQuery();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpenSearchModal(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setOpenSearchModal]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim()) {
                trigger(query.trim());
            }
        }, 350);
        return () => clearTimeout(delay);
    }, [query, trigger]);

    const results: any[] = data?.data || [];
    const isSearching = isLoading || isFetching;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 pt-16 sm:pt-4 animate-in fade-in duration-150"
            onClick={() => setOpenSearchModal(false)}
        >
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                        {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Quick search stock by medicine name..."
                        className="w-full text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 outline-none bg-transparent"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-2">
                    {!query.trim() && (
                        <div className="py-8 px-4 text-center space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                                <Boxes size={22} />
                            </div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Quick Stock Search</p>
                            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                                Type a medicine name to quickly check inventory stock levels and location.
                            </p>
                        </div>
                    )}

                    {query.trim() && isSearching && results.length === 0 && (
                        <div className="py-8 text-center text-xs font-semibold text-slate-400 animate-pulse">
                            Searching stock inventory...
                        </div>
                    )}

                    {query.trim() && !isSearching && results.length === 0 && (
                        <div className="py-8 px-4 text-center space-y-2">
                            <p className="text-xs font-bold text-slate-800 dark:text-white">No Stock Found</p>
                            <p className="text-[11px] text-slate-400">
                                No stock record matches "<span className="font-bold text-slate-600 dark:text-slate-300">{query}</span>".
                            </p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                                Matching Stock Items ({results.length})
                            </p>
                            <div className="space-y-1">
                                {results.map((stock) => (
                                    <div
                                        key={stock._id}
                                        onClick={() => setOpenSearchModal(false)}
                                        className="group p-3 rounded-2xl border border-transparent hover:border-emerald-200 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-emerald-50/60 transition-all cursor-pointer flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 border border-slate-100 dark:border-slate-700 shrink-0">
                                                <Boxes size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                                    {stock.medicine?.name || "Medicine Item"}
                                                </h4>
                                                <p className="text-[10px] text-slate-400">
                                                    Qty: {stock.quantity} • Location: {stock.location || "Store"}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Press ESC to exit</span>
                    <button
                        type="button"
                        onClick={() => setOpenSearchModal(false)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockSearch;
