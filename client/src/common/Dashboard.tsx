import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    Boxes,
    ChevronRight,
    Clock,
    DollarSign,
    Layers,
    PackageCheck,
    Pill,
    Plus,
    ShieldAlert,
    Tag,
    TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllBrandsQuery } from "../brand/api/brandApi";
import { useGetAllCategoriesQuery } from "../category/api/categoryApi";
import { useGetAllMedicinesQuery } from "../medicine/api/medicineApi";
import MedicineFormModal from "../medicine/components/MedicineFormModal";
import type { IBrand } from "../types/brand";
import type { ICategory } from "../types/category";
import type { IMedicine } from "../types/medicine";

const Dashboard = () => {
    const navigate = useNavigate();
    const [openAddModal, setOpenAddModal] = useState(false);

    const { data: medicinesRes, isLoading: loadingMeds } = useGetAllMedicinesQuery(undefined);
    const { data: brandsRes, isLoading: loadingBrands } = useGetAllBrandsQuery(undefined);
    const { data: categoriesRes, isLoading: loadingCats } = useGetAllCategoriesQuery(undefined);

    const medicines: IMedicine[] = medicinesRes?.data || [];
    const brands: IBrand[] = brandsRes?.data || [];
    const categories: ICategory[] = categoriesRes?.data || [];

    // Calculated Dashboard Metrics
    const activeMedicines = medicines.filter((m) => !m.isDeleted);
    const totalMedicines = activeMedicines.length;

    const totalStockUnits = activeMedicines.reduce((acc, m) => acc + (m.stock || 0), 0);

    const totalInventoryValue = activeMedicines.reduce(
        (acc, m) => acc + (m.sellingPrice || 0) * (m.stock || 0),
        0
    );

    const totalInvestment = activeMedicines.reduce(
        (acc, m) => acc + (m.purchasePrice || 0) * (m.stock || 0),
        0
    );

    const estimatedProfit = totalInventoryValue - totalInvestment;

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const lowStockMedicines = activeMedicines.filter((m) => (m.stock ?? 0) <= 10);
    const expiringSoonMedicines = activeMedicines.filter((m) => {
        if (!m.expiry) return false;
        const expDate = new Date(m.expiry);
        return expDate > now && expDate <= thirtyDaysFromNow;
    });

    const expiredMedicines = activeMedicines.filter((m) => {
        if (!m.expiry) return false;
        return new Date(m.expiry) <= now;
    });

    const isLoading = loadingMeds || loadingBrands || loadingCats;

    return (
        <div className="p-4 sm:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* HERO / HEADER BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-green-700 dark:bg-green-900 p-6 sm:p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-800/80 text-green-100 text-xs font-semibold border border-green-500/40">
                            <Activity size={14} className="animate-pulse text-green-300" />
                            MediSync Directory Live Operations
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                            Medical Directory & Inventory
                        </h1>
                        <p className="text-green-100 text-sm sm:text-base max-w-xl">
                            Monitor live medicine stock levels, expiry alerts, category distributions, and financial valuation.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setOpenAddModal(true)}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 text-green-800 dark:text-green-300 font-bold text-sm shadow-lg hover:bg-green-50 dark:hover:bg-slate-800 transition-all cursor-pointer transform hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            Add Medicine
                        </button>
                        <button
                            onClick={() => navigate("/medicines")}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-800 dark:bg-green-950 text-white font-semibold text-sm hover:bg-green-900 transition-all border border-green-600 dark:border-green-800 cursor-pointer"
                        >
                            View Directory
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ALERT BANNERS */}
            {(lowStockMedicines.length > 0 || expiringSoonMedicines.length > 0 || expiredMedicines.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lowStockMedicines.length > 0 && (
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100">
                                        Low Stock Warning ({lowStockMedicines.length} items)
                                    </h4>
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                        {lowStockMedicines.slice(0, 2).map((m) => m.name).join(", ")} {lowStockMedicines.length > 2 ? "..." : ""} have ≤ 10 units left.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/medicines")}
                                className="text-xs font-bold text-amber-800 dark:text-amber-300 underline hover:text-amber-950 cursor-pointer whitespace-nowrap"
                            >
                                Restock
                            </button>
                        </div>
                    )}

                    {(expiringSoonMedicines.length > 0 || expiredMedicines.length > 0) && (
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-sm">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-rose-950 dark:text-rose-100">
                                        Expiry Risk ({expiredMedicines.length} Expired, {expiringSoonMedicines.length} Expiring Soon)
                                    </h4>
                                    <p className="text-xs text-rose-700 dark:text-rose-300">
                                        Check medicine shelf lives to clear out near-expiry batches.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/medicines")}
                                className="text-xs font-bold text-rose-800 dark:text-rose-300 underline hover:text-rose-950 cursor-pointer whitespace-nowrap"
                            >
                                Inspect
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Total Medicines */}
                <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Total Medicines
                        </span>
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Pill size={22} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                            {isLoading ? "-" : totalMedicines}
                        </span>
                        <span className="inline-flex items-center text-xs font-bold text-green-600 dark:text-green-400">
                            <TrendingUp size={14} className="mr-0.5" />
                            Directory Active
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                        {medicines.filter((m) => m.isDeleted).length} archived in soft-delete
                    </p>
                </div>

                {/* 2. Total Stock Units */}
                <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Stock Units
                        </span>
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Boxes size={22} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                            {isLoading ? "-" : totalStockUnits.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Units available
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                        Across {brands.length} partner brands
                    </p>
                </div>

                {/* 3. Valuation & Stock Worth */}
                <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Inventory Worth
                        </span>
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <DollarSign size={22} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                            {isLoading ? "-" : `₹${totalInventoryValue.toLocaleString()}`}
                        </span>
                        <span className="inline-flex items-center text-xs font-bold text-green-600 dark:text-green-400">
                            <ArrowUpRight size={14} />
                            Est. Value
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                        Est. Margin: <span className="font-bold text-slate-700 dark:text-slate-200">₹{estimatedProfit > 0 ? estimatedProfit.toLocaleString() : 0}</span>
                    </p>
                </div>

                {/* 4. Brands & Categories */}
                <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Taxonomy & Brands
                        </span>
                        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Layers size={22} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                            {isLoading ? "-" : `${categories.length} / ${brands.length}`}
                        </span>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            Cats / Brands
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                        Structured catalog hierarchy
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT GRID: Recent Medicines Table & Sidebar Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT 2 COLUMNS: RECENT MEDICINES TABLE */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Recent Medicines</h3>
                            <p className="text-xs text-slate-400">Latest entries added to the directory</p>
                        </div>
                        <button
                            onClick={() => navigate("/medicines")}
                            className="text-xs font-bold text-green-600 dark:text-green-400 hover:text-green-700 flex items-center gap-1 cursor-pointer"
                        >
                            View All
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    <th className="py-3.5 px-6">Medicine Name</th>
                                    <th className="py-3.5 px-4">Brand</th>
                                    <th className="py-3.5 px-4">Selling Price</th>
                                    <th className="py-3.5 px-4">Stock</th>
                                    <th className="py-3.5 px-4">Expiry Date</th>
                                    <th className="py-3.5 px-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {activeMedicines.slice(0, 5).map((med) => {
                                    const brandName = typeof med.brand === "object" ? med.brand?.name : "N/A";
                                    const isLow = (med.stock ?? 0) <= 10;
                                    const isExpired = med.expiry && new Date(med.expiry) <= now;

                                    return (
                                        <tr
                                            key={med._id}
                                            onClick={() => navigate(`/medicines/${med._id}`)}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                                        >
                                            <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">
                                                {med.name}
                                                {med.batchNumber && (
                                                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                                        Batch: {med.batchNumber}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                {brandName}
                                            </td>
                                            <td className="py-4 px-4 font-bold text-green-700 dark:text-green-400">
                                                ₹{med.sellingPrice || 0}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        isLow
                                                            ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                    }`}
                                                >
                                                    {med.stock ?? 0}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                {med.expiry
                                                    ? new Date(med.expiry).toLocaleDateString("en-IN", {
                                                          month: "short",
                                                          year: "numeric"
                                                      })
                                                    : "-"}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {isExpired ? (
                                                    <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-full">
                                                        Expired
                                                    </span>
                                                ) : isLow ? (
                                                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2.5 py-1 rounded-full">
                                                        Available
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {activeMedicines.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
                                            No active medicines found in directory.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT 1 COLUMN: QUICK LINKS & CATEGORY DISTRIBUTION */}
                <div className="space-y-6">
                    {/* Quick Shortcuts Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                            <PackageCheck size={18} className="text-green-600 dark:text-green-400" />
                            Quick Directories
                        </h3>

                        <div className="space-y-2">
                            <div
                                onClick={() => navigate("/medicines")}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                                        <Pill size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Medicines</h4>
                                        <p className="text-[10px] text-slate-400">{medicines.length} total entries</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-400" />
                            </div>

                            <div
                                onClick={() => navigate("/brands")}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                                        <Tag size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Brands</h4>
                                        <p className="text-[10px] text-slate-400">{brands.length} manufacturers</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-400" />
                            </div>

                            <div
                                onClick={() => navigate("/categories")}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                                        <Layers size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Categories</h4>
                                        <p className="text-[10px] text-slate-400">{categories.length} therapeutic classes</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Expiry Health Summary Widget */}
                    <div className="bg-green-900 dark:bg-slate-900 border border-green-800 dark:border-slate-800 text-white p-6 rounded-3xl shadow-lg space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-green-200">
                                Inventory Health
                            </span>
                            <Clock size={18} className="text-green-400" />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-green-100">Healthy Shelf Life</span>
                                    <span className="text-green-300 font-bold">
                                        {activeMedicines.length > 0
                                            ? Math.round(
                                                  ((activeMedicines.length - expiringSoonMedicines.length - expiredMedicines.length) /
                                                      activeMedicines.length) *
                                                      100
                                              )
                                            : 100}
                                        %
                                    </span>
                                </div>
                                <div className="w-full bg-green-950 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full transition-all duration-500"
                                        style={{
                                            width: `${
                                                activeMedicines.length > 0
                                                    ? ((activeMedicines.length - expiringSoonMedicines.length - expiredMedicines.length) /
                                                          activeMedicines.length) *
                                                      100
                                                    : 100
                                            }%`
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 grid grid-cols-2 gap-2 text-center text-xs">
                                <div className="bg-green-800/80 dark:bg-slate-800 p-2.5 rounded-xl border border-green-700/50 dark:border-slate-700">
                                    <span className="block text-green-200 text-[10px] font-medium">Expiring &lt; 30 days</span>
                                    <span className="font-extrabold text-amber-300 text-sm">
                                        {expiringSoonMedicines.length}
                                    </span>
                                </div>
                                <div className="bg-green-800/80 dark:bg-slate-800 p-2.5 rounded-xl border border-green-700/50 dark:border-slate-700">
                                    <span className="block text-green-200 text-[10px] font-medium">Expired</span>
                                    <span className="font-extrabold text-rose-300 text-sm">
                                        {expiredMedicines.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FOR QUICK ADD MEDICINE */}
            {openAddModal && <MedicineFormModal setOpenModal={setOpenAddModal} />}
        </div>
    );
};

export default Dashboard;
