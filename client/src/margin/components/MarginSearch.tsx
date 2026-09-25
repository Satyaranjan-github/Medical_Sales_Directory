import { Percent, Search, X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyGetMarginSuggestionsQuery } from "../api/marginApi";

const MarginSearch = ({
    setOpenSearchModal
}: {
    setOpenSearchModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [triggerSuggestions, { data: suggestionsRes, isLoading }] = useLazyGetMarginSuggestionsQuery();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (val.trim()) {
            triggerSuggestions(val.trim());
        }
    };

    const suggestions = suggestionsRes?.data || [];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 backdrop-blur-md p-4 pt-20 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-200">
                <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <Search size={20} className="text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search margin title..."
                            autoFocus
                            className="w-full text-base font-semibold bg-transparent text-slate-900 dark:text-white outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setOpenSearchModal(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </header>

                <main className="max-h-80 overflow-y-auto p-3">
                    {isLoading && (
                        <div className="p-6 text-center text-xs font-semibold text-slate-400">
                            Searching margins...
                        </div>
                    )}

                    {!isLoading && searchTerm && suggestions.length === 0 && (
                        <div className="p-6 text-center text-xs font-semibold text-slate-400">
                            No matching margins found.
                        </div>
                    )}

                    {!isLoading && suggestions.length > 0 && (
                        <div className="space-y-1">
                            {suggestions.map((item: { _id: string; title: string; value: number }) => (
                                <div
                                    key={item._id}
                                    onClick={() => {
                                        setOpenSearchModal(false);
                                        navigate(`/margins/${item._id}`);
                                    }}
                                    className="p-3 rounded-2xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                            <Percent size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                            {item.title}
                                        </span>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                                        {item.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!searchTerm && (
                        <div className="p-6 text-center text-xs font-semibold text-slate-400">
                            Type to search for margin tiers.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MarginSearch;
