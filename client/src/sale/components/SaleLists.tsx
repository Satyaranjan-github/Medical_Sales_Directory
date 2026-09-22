import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Filter,
    Pill,
    Plus,
    Printer,
    RefreshCw,
    Search,
    ShoppingBag,
    Trash2,
    User,
    X
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IMedicine } from "../../types/medicine";
import type { ISale } from "../../types/sale";
import { useGetAllSalesQuery } from "../api/saleApi";
import useSaleOperations from "../hooks/useSaleOperations";
import SaleModal from "./SaleModal";
import SaleReceiptModal from "./SaleReceiptModal";
import LoadingModal from "../../common/LoadingModal";

const SaleLists = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);

    const { data: salesRes, isLoading, refetch } = useGetAllSalesQuery({ page, limit });
    const { deleteSale, restoreSale, deleteSalePermanently } = useSaleOperations();

    const [openSaleModal, setOpenSaleModal] = useState(false);
    const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<ISale | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
    const [showFilters, setShowFilters] = useState(false);

    const rawSales: ISale[] = salesRes?.data || [];
    const totalPages: number = salesRes?.totalPages || 1;
    const totalSales: number = salesRes?.total || rawSales.length;

    const startItem = totalSales === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalSales);

    // Client-side filtering for search & status triggers
    const filteredSales = rawSales.filter((sale) => {
        const matchesSearch =
            !searchQuery ||
            sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.customerPhone?.includes(searchQuery) ||
            sale._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.medicines?.some((m) => {
                const medName = typeof m.medicine === "object" ? (m.medicine as IMedicine).name : "";
                return medName.toLowerCase().includes(searchQuery.toLowerCase());
            });

        const matchesMode = paymentModeFilter === "ALL" || sale.paymentMode === paymentModeFilter;
        const matchesStatus = paymentStatusFilter === "ALL" || sale.paymentStatus === paymentStatusFilter;

        return matchesSearch && matchesMode && matchesStatus;
    });

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

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (window.confirm("Are you sure you want to soft delete this sale record? Inventory stock will be replenished.")) {
            await deleteSale(id);
            refetch();
        }
    };

    const handleRestore = async (id?: string) => {
        if (!id) return;
        await restoreSale(id);
        refetch();
    };

    const handlePermanentDelete = async (id?: string) => {
        if (!id) return;
        if (window.confirm("CRITICAL WARNING: Permanently delete this sale record? This action cannot be undone.")) {
            await deleteSalePermanently(id);
            refetch();
        }
    };

    return (
        <div className="p-4 sm:p-12 space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200 pb-24">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <ShoppingBag size={20} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Sales Registry
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Browse and manage your customer sales transactions & billing history.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setOpenSaleModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm shadow-md hover:bg-green-700 transition-all cursor-pointer"
                    >
                        <Plus size={18} />
                        Record New Sale
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm shadow-xs transition-all cursor-pointer ${showFilters || searchQuery || paymentModeFilter !== "ALL" || paymentStatusFilter !== "ALL"
                            ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                    >
                        <Filter size={18} />
                        {showFilters ? "Hide Filters" : "Filter Sales"}
                    </button>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                        title="Refresh Sales"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* SEARCH & FILTER BAR */}
            {showFilters && (
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center animate-in fade-in duration-150">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by customer name, phone, receipt # or medicine..."
                            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Payment Mode Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs font-bold text-slate-400 shrink-0">Mode:</span>
                        <select
                            value={paymentModeFilter}
                            onChange={(e) => setPaymentModeFilter(e.target.value)}
                            className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold text-xs outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
                        >
                            <option value="ALL">All Modes</option>
                            <option value="CASH">CASH</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">CARD</option>
                            <option value="NET_BANKING">NET BANKING</option>
                        </select>
                    </div>

                    {/* Payment Status Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs font-bold text-slate-400 shrink-0">Status:</span>
                        <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold text-xs outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PAID">PAID</option>
                            <option value="PENDING">PENDING</option>
                        </select>
                    </div>
                </div>
            )}

            {/* LOADING STATE */}
            {isLoading && <LoadingModal />}

            {/* SALES GRID */}
            {!isLoading && filteredSales.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                    {filteredSales.map((sale) => (
                        <SaleCard
                            key={sale._id}
                            sale={sale}
                            onSelect={() => navigate(`/sales/${sale._id}`)}
                            onReceipt={(e) => {
                                e.stopPropagation();
                                setSelectedSaleForReceipt(sale);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                handleDelete(sale._id);
                            }}
                            onRestore={(e) => {
                                e.stopPropagation();
                                handleRestore(sale._id);
                            }}
                            onPermanentDelete={(e) => {
                                e.stopPropagation();
                                handlePermanentDelete(sale._id);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && filteredSales.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                        <ShoppingBag size={28} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Sales Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Get started by recording your first sales transaction.
                    </p>
                    <button
                        type="button"
                        onClick={() => setOpenSaleModal(true)}
                        className="py-2.5 px-5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                        <Plus size={16} /> Record First Sale
                    </button>
                </div>
            )}

            {/* FIXED BOTTOM PAGINATION CONTROLS (FLOATING GLASS BAR) */}
            {!isLoading && totalSales > 0 && (
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
                                <span className="font-bold text-slate-900 dark:text-white">{totalSales}</span>
                                <span className="hidden sm:inline">sales</span>
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
                            {/* First Page */}
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={page <= 1}
                                title="First Page"
                                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Last Page */}
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={page >= totalPages}
                                title="Last Page"
                                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {openSaleModal && <SaleModal setOpenModal={setOpenSaleModal} />}
            {selectedSaleForReceipt && (
                <SaleReceiptModal
                    sale={selectedSaleForReceipt}
                    setOpenModal={() => setSelectedSaleForReceipt(null)}
                />
            )}
        </div>
    );
};

export default SaleLists;

// Individual Sale Card Component (matching MedicineCard design)
const SaleCard = ({
    sale,
    onSelect,
    onReceipt,
    onDelete,
    onRestore,
    onPermanentDelete
}: {
    sale: ISale;
    onSelect: () => void;
    onReceipt: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    onRestore: (e: React.MouseEvent) => void;
    onPermanentDelete: (e: React.MouseEvent) => void;
}) => {
    const formattedDate = sale.saleDate
        ? new Date(sale.saleDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        : "-";

    const medicineCount = sale.medicines?.length || 0;

    return (
        <div
            onClick={onSelect}
            className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-md ${sale.isDeleted
                ? "border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20"
                : "border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-600"
                }`}
        >
            <div>
                {/* Header Title & Price */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-snug">
                            {sale.customerName}
                        </h3>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide block">
                            #{sale._id?.slice(-8).toUpperCase()} • {formattedDate}
                        </span>
                    </div>

                    {sale.totalAmount !== undefined && (
                        <span className="text-sm font-extrabold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 px-2.5 py-1 rounded-lg border border-green-200/60 dark:border-green-800/60 shrink-0">
                            ₹{sale.totalAmount?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Tags (Payment Mode, Status, Customer Phone) */}
                <div className="flex flex-wrap gap-1.5 my-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        <CreditCard size={10} />
                        {sale.paymentMode}
                    </span>

                    <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${sale.paymentStatus === "PAID"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800"
                            }`}
                    >
                        <CheckCircle2 size={10} />
                        {sale.paymentStatus}
                    </span>

                    {sale.customerPhone && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800">
                            <User size={10} />
                            {sale.customerPhone}
                        </span>
                    )}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-3" />

                {/* Details Breakdown - Medicines List */}
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <Pill size={12} />
                            Medicines Purchased ({medicineCount})
                        </span>
                    </div>

                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                        {sale.medicines?.map((m, i) => {
                            const medName = typeof m.medicine === "object" ? (m.medicine as IMedicine).name : "Medicine Item";
                            return (
                                <div key={i} className="flex items-center justify-between text-slate-700 dark:text-slate-300 text-xs font-semibold">
                                    <span className="truncate max-w-[170px]">{medName}</span>
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                        x{m.quantity}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Quick Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        onClick={onReceipt}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors cursor-pointer"
                        title="Print / View Invoice Receipt"
                    >
                        <Printer size={15} />
                    </button>

                    {!sale.isDeleted ? (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Soft Delete Sale"
                        >
                            <Trash2 size={15} />
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onRestore}
                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                                title="Restore Sale"
                            >
                                <RefreshCw size={15} />
                            </button>
                            <button
                                type="button"
                                onClick={onPermanentDelete}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                                title="Delete Permanently"
                            >
                                <Trash2 size={15} />
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1 font-bold text-green-600 dark:text-green-400">
                    <span>View Details</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {sale.isDeleted && (
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Archived
                </span>
            )}
        </div>
    );
};

