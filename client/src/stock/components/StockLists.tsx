import {
    Boxes,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Eye,
    Filter,
    MapPin,
    Plus,
    RefreshCw,
    Search,
    Trash2
} from "lucide-react";
import { useState } from "react";
import type { IStock } from "../../types/stock";
import { useGetAllStocksQuery } from "../api/stockApi";
import useStockOperations from "../hooks/useStockOperations";
import StockDetailsModal from "./StockDetailsModal";
import StockFormModal from "./StockFormModal";

export const StockLists = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

    // Modal States
    const [openFormModal, setOpenFormModal] = useState(false);
    const [stockToEdit, setStockToEdit] = useState<IStock | null>(null);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [stockToView, setStockToView] = useState<IStock | null>(null);

    const { data: stocksRes, isLoading, refetch } = useGetAllStocksQuery({
        page,
        limit,
        status: selectedStatusFilter !== "ALL" ? selectedStatusFilter : undefined
    });

    const { deleteStock, restoreStock, deleteStockPermanently } = useStockOperations();

    const stocksList: IStock[] = Array.isArray(stocksRes?.data) ? stocksRes.data : (stocksRes?.data?.stocks || []);
    const totalCount = stocksRes?.total || stocksRes?.data?.total || 0;
    const totalPages = stocksRes?.totalPages || stocksRes?.data?.totalPages || 1;

    // Filter stocks locally by search query over medicine name or location
    const filteredStocks = stocksList.filter((stock) => {
        const medName = typeof stock.medicine === "object" ? stock.medicine?.name : "";
        const loc = stock.location || "";
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            medName.toLowerCase().includes(query) ||
            loc.toLowerCase().includes(query)
        );
    });

    const handleCreateNew = () => {
        setStockToEdit(null);
        setOpenFormModal(true);
    };

    const handleEdit = (stock: IStock) => {
        setStockToEdit(stock);
        setOpenFormModal(true);
    };

    const handleView = (stock: IStock) => {
        setStockToView(stock);
        setOpenDetailsModal(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "IN_STOCK":
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        In Stock
                    </span>
                );
            case "LOW_STOCK":
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Low Stock
                    </span>
                );
            case "OUT_OF_STOCK":
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Out of Stock
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Page Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                        <Boxes size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Stock Inventory
                        </h1>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Monitor and manage medicine inventory stock levels ({totalCount} total items)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        title="Refresh stock list"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Add Stock Entry</span>
                    </button>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3.5 top-3 text-slate-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search stock by medicine name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-semibold placeholder:text-slate-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 transition-all"
                    />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                        <Filter size={14} /> Filter:
                    </span>
                    {["ALL", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].map((statusKey) => (
                        <button
                            key={statusKey}
                            onClick={() => {
                                setSelectedStatusFilter(statusKey);
                                setPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                                selectedStatusFilter === statusKey
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {statusKey === "ALL"
                                ? "All Stocks"
                                : statusKey === "IN_STOCK"
                                ? "In Stock"
                                : statusKey === "LOW_STOCK"
                                ? "Low Stock"
                                : "Out of Stock"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                <th className="py-3.5 px-4 sm:px-6">Medicine Item</th>
                                <th className="py-3.5 px-4">Quantity</th>
                                <th className="py-3.5 px-4">Min Alert Level</th>
                                <th className="py-3.5 px-4">Location</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold animate-pulse">
                                        Loading inventory stocks...
                                    </td>
                                </tr>
                            ) : filteredStocks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Boxes size={32} className="text-slate-300 dark:text-slate-600" />
                                            <p className="font-bold text-slate-700 dark:text-slate-300">No stock records found</p>
                                            <p className="text-[11px] text-slate-400">
                                                {searchQuery
                                                    ? `No matches for "${searchQuery}"`
                                                    : "Create a stock entry or add a new medicine item."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStocks.map((stock) => {
                                    const med = typeof stock.medicine === "object" ? stock.medicine : null;
                                    const isSoftDeleted = stock.isDeleted;

                                    return (
                                        <tr
                                            key={stock._id}
                                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                                                isSoftDeleted ? "opacity-50 bg-slate-50/40 dark:bg-slate-900/40" : ""
                                            }`}
                                        >
                                            {/* Medicine Info */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                                                        {med?.name || "Medicine Item"}
                                                    </span>
                                                    {med?.batchNumber && (
                                                        <span className="text-[10px] font-mono text-slate-400">
                                                            Batch: {med.batchNumber}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Quantity */}
                                            <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                                                <span className="text-sm">{stock.quantity}</span> Units
                                            </td>

                                            {/* Min Level */}
                                            <td className="py-4 px-4 font-bold text-slate-500 dark:text-slate-400">
                                                {stock.minStockLevel} Units
                                            </td>

                                            {/* Location */}
                                            <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={13} className="text-slate-400 shrink-0" />
                                                    <span>{stock.location || "Main Store"}</span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-4">{getStatusBadge(stock.status)}</td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-4 sm:pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleView(stock)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                                                        title="View details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {!isSoftDeleted ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEdit(stock)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                                                                title="Edit stock"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => stock._id && deleteStock(stock._id)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                                                title="Soft delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => stock._id && restoreStock(stock._id)}
                                                                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                                                            >
                                                                Restore
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => stock._id && deleteStockPermanently(stock._id)}
                                                                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 transition-colors cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                        <span>Show</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>entries per page (Total {totalCount})</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span>
                            Page <strong className="text-slate-900 dark:text-white">{page}</strong> of{" "}
                            <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
                        </span>
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            <StockFormModal
                openModal={openFormModal}
                setOpenModal={setOpenFormModal}
                stockToEdit={stockToEdit}
            />

            {/* Details Modal */}
            <StockDetailsModal
                openModal={openDetailsModal}
                setOpenModal={setOpenDetailsModal}
                stock={stockToView}
            />
        </div>
    );
};

export default StockLists;
