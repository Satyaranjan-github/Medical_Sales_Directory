import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    BarChart3,
    Boxes,
    Building2,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    IndianRupee,
    Layers,
    Pill,
    Plus,
    ShieldAlert,
    ShoppingBag,
    Sparkles,
    Tag,
    TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllBrandsQuery } from "../brand/api/brandApi";
import { useGetAllCategoriesQuery } from "../category/api/categoryApi";
import { useGetAllMedicinesQuery } from "../medicine/api/medicineApi";
import MedicineFormModal from "../medicine/components/MedicineFormModal";
import ReportsModal from "./ReportsModal";
import SaleFormModal, { type ISaleRecord } from "./SaleFormModal";
import type { IBrand } from "../types/brand";
import type { ICategory } from "../types/category";
import type { IMedicine } from "../types/medicine";

const INITIAL_SALES: ISaleRecord[] = [
    {
        id: "SALE-9021",
        customerName: "Anil Sharma",
        customerPhone: "+91 9812345678",
        medicineName: "Amoxicillin 500mg",
        medicineId: "1",
        quantity: 2,
        unitPrice: 120,
        totalAmount: 240,
        discount: 0,
        paymentMode: "UPI",
        paymentStatus: "PAID",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "SALE-9022",
        customerName: "Pooja Verma",
        customerPhone: "+91 9876512345",
        medicineName: "Paracetamol 650mg",
        medicineId: "2",
        quantity: 5,
        unitPrice: 30,
        totalAmount: 150,
        discount: 0,
        paymentMode: "CASH",
        paymentStatus: "PAID",
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "SALE-9023",
        customerName: "Suresh Gupta",
        customerPhone: "+91 9988776655",
        medicineName: "Metformin 500mg",
        medicineId: "3",
        quantity: 3,
        unitPrice: 85,
        totalAmount: 255,
        discount: 10,
        paymentMode: "CREDIT CARD",
        paymentStatus: "PAID",
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openSaleModal, setOpenSaleModal] = useState(false);
    const [openReportsModal, setOpenReportsModal] = useState(false);

    const { data: medicinesRes, isLoading: loadingMeds } = useGetAllMedicinesQuery(undefined);
    const { data: brandsRes, isLoading: loadingBrands } = useGetAllBrandsQuery(undefined);
    const { data: categoriesRes, isLoading: loadingCats } = useGetAllCategoriesQuery(undefined);

    const medicines: IMedicine[] = medicinesRes?.data || [];
    const brands: IBrand[] = brandsRes?.data || [];
    const categories: ICategory[] = categoriesRes?.data || [];

    const [sales, setSales] = useState<ISaleRecord[]>(() => {
        const saved = localStorage.getItem("medisync_sales");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return INITIAL_SALES;
            }
        }
        return INITIAL_SALES;
    });

    const handleAddSale = (newSale: ISaleRecord) => {
        const updated = [newSale, ...sales];
        setSales(updated);
        localStorage.setItem("medisync_sales", JSON.stringify(updated));
    };

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

    // Sales Metrics
    const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalSalesCount = sales.length;
    const avgOrderValue = totalSalesCount > 0 ? Math.round(totalSalesRevenue / totalSalesCount) : 0;
    const paidSalesCount = sales.filter((s) => s.paymentStatus === "PAID").length;

    // Stock Expiry & Low Stock Alerts
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

    const healthyStockCount = Math.max(
        0,
        activeMedicines.length - expiringSoonMedicines.length - expiredMedicines.length
    );
    const inventoryHealthPercent =
        activeMedicines.length > 0 ? Math.round((healthyStockCount / activeMedicines.length) * 100) : 100;

    const isLoading = loadingMeds || loadingBrands || loadingCats;

    return (
        <div className="p-4 sm:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* QUICK ACTIONS BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                    onClick={() => setOpenAddModal(true)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left group flex items-center gap-3"
                >
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Plus size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">Add Medicine</h4>
                        <p className="text-[10px] text-slate-400">Register new stock</p>
                    </div>
                </button>

                <button
                    onClick={() => setOpenSaleModal(true)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left group flex items-center gap-3"
                >
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">Add Sale</h4>
                        <p className="text-[10px] text-slate-400">POS checkout entry</p>
                    </div>
                </button>

                <button
                    onClick={() => setOpenReportsModal(true)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left group flex items-center gap-3"
                >
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">View Reports</h4>
                        <p className="text-[10px] text-slate-400">Full audit statement</p>
                    </div>
                </button>

                <button
                    onClick={() => navigate("/medicines")}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer text-left group flex items-center gap-3"
                >
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Pill size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">Directory Stock</h4>
                        <p className="text-[10px] text-slate-400">Browse {medicines.length} products</p>
                    </div>
                </button>
            </div>

            {/* SALES OVERVIEW SECTION */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                Sales Overview
                            </h2>
                            <p className="text-xs text-slate-400">Live POS checkout revenue and payment settlement statistics</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpenSaleModal(true)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                        <Plus size={14} /> New Sale Entry
                    </button>
                </div>

                {/* Sales KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Sales Revenue</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                                ₹{totalSalesRevenue.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center">
                                <TrendingUp size={14} className="mr-0.5" /> Live POS
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">Across {totalSalesCount} recorded checkouts</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Completed Orders</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                                {totalSalesCount}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                                Transactions
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{paidSalesCount} paid in full</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Average Order Value</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                                ₹{avgOrderValue.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-emerald-600">
                                <ArrowUpRight size={14} /> Per order
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">Calculated checkout average</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Settlement Mode</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                                {totalSalesCount > 0 ? Math.round((paidSalesCount / totalSalesCount) * 100) : 100}%
                            </span>
                            <span className="text-xs font-bold text-emerald-600">Settled</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">UPI, Cash & Card transactions</p>
                    </div>
                </div>

                {/* Recent Sales Transactions Stream */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Recent POS Sales Feed</h3>
                            <p className="text-xs text-slate-400">Latest recorded transactions & checkout details</p>
                        </div>
                        <span className="text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                            {sales.length} Transactions
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    <th className="py-3 px-5">Receipt ID</th>
                                    <th className="py-3 px-4">Customer</th>
                                    <th className="py-3 px-4">Medicine Item</th>
                                    <th className="py-3 px-4">Qty</th>
                                    <th className="py-3 px-4">Total Bill</th>
                                    <th className="py-3 px-4">Mode</th>
                                    <th className="py-3 px-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                                {sales.slice(0, 5).map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                                        <td className="py-3.5 px-5 font-black text-slate-900 dark:text-white">
                                            {sale.id}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                                            {sale.customerName}
                                            <span className="block text-[10px] text-slate-400 font-normal">{sale.customerPhone}</span>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                                            {sale.medicineName}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-400">
                                            {sale.quantity} units
                                        </td>
                                        <td className="py-3.5 px-4 font-extrabold text-blue-600 dark:text-blue-400">
                                            ₹{sale.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                <CreditCard size={10} />
                                                {sale.paymentMode}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 text-right">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                <CheckCircle2 size={10} />
                                                {sale.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CATEGORY INSIGHTS SECTION */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                Category Insights
                            </h2>
                            <p className="text-xs text-slate-400">Therapeutic classification breakdown & inventory valuation</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/categories")}
                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                        View Categories <ChevronRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => {
                        const catMeds = activeMedicines.filter((m) => {
                            const catId = typeof m.category === "object" ? m.category?._id : m.category;
                            return catId === cat._id;
                        });
                        const catStock = catMeds.reduce((acc, m) => acc + (m.stock || 0), 0);
                        const catValuation = catMeds.reduce(
                            (acc, m) => acc + (m.sellingPrice || 0) * (m.stock || 0),
                            0
                        );
                        const catShare =
                            totalInventoryValue > 0
                                ? Math.round((catValuation / totalInventoryValue) * 100)
                                : 0;

                        return (
                            <div
                                key={cat._id}
                                onClick={() => navigate(`/categories/${cat._id}`)}
                                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer space-y-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold">
                                            <Layers size={16} />
                                        </div>
                                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-snug">
                                            {cat.name}
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/50 dark:border-purple-800/50">
                                        {catMeds.length} items
                                    </span>
                                </div>

                                <div className="flex items-baseline justify-between text-xs pt-1">
                                    <span className="text-slate-400 font-medium">Stock Units:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{catStock.toLocaleString()} units</span>
                                </div>

                                <div className="flex items-baseline justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Category Worth:</span>
                                    <span className="font-black text-purple-700 dark:text-purple-300">₹{catValuation.toLocaleString()}</span>
                                </div>

                                <div className="space-y-1 pt-1">
                                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                                        <span>Catalog Share</span>
                                        <span>{catShare}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-purple-600 dark:bg-purple-500 h-full rounded-full"
                                            style={{ width: `${catShare}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {categories.length === 0 && (
                        <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
                            No categories registered in system.
                        </div>
                    )}
                </div>
            </div>

            {/* BRAND INSIGHTS SECTION */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                            <Tag size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                Brand Insights
                            </h2>
                            <p className="text-xs text-slate-400">Pharmaceutical manufacturer lines & stock valuation distribution</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/brands")}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                        View Brands <ChevronRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands.map((b) => {
                        const bMeds = activeMedicines.filter((m) => {
                            const bId = typeof m.brand === "object" ? m.brand?._id : m.brand;
                            return bId === b._id;
                        });
                        const bStock = bMeds.reduce((acc, m) => acc + (m.stock || 0), 0);
                        const bValuation = bMeds.reduce(
                            (acc, m) => acc + (m.sellingPrice || 0) * (m.stock || 0),
                            0
                        );

                        return (
                            <div
                                key={b._id}
                                onClick={() => navigate(`/brands/${b._id}`)}
                                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer space-y-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold">
                                            <Building2 size={16} />
                                        </div>
                                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-snug">
                                            {b.name}
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/50">
                                        {bMeds.length} products
                                    </span>
                                </div>

                                <div className="flex items-baseline justify-between text-xs pt-1">
                                    <span className="text-slate-400 font-medium">Available Units:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{bStock.toLocaleString()} units</span>
                                </div>

                                <div className="flex items-baseline justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Brand Stock Worth:</span>
                                    <span className="font-black text-amber-600 dark:text-amber-400">₹{bValuation.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}

                    {brands.length === 0 && (
                        <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
                            No brands registered in system.
                        </div>
                    )}
                </div>
            </div>

            {/* PRODUCT INSIGHTS SECTION */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                            <Pill size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                Product Insights & Financial Analytics
                            </h2>
                            <p className="text-xs text-slate-400">Highest valuation products, profit margins, and critical re-orders</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/medicines")}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                        Directory <ChevronRight size={14} />
                    </button>
                </div>

                {/* Financial Summary Highlight Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white p-6 rounded-3xl shadow-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                                Total Inventory Selling Valuation
                            </span>
                            <DollarSign size={20} className="text-emerald-200" />
                        </div>
                        <h3 className="text-3xl font-black">₹{totalInventoryValue.toLocaleString()}</h3>
                        <p className="text-xs text-emerald-100">Estimated gross value if all stock is sold</p>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Total Purchase Cost Investment
                            </span>
                            <IndianRupee size={20} className="text-slate-400" />
                        </div>
                        <h3 className="text-3xl font-black">₹{totalInvestment.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400">Capital spent on stock acquisition</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-purple-200">
                                Estimated Profit Margin
                            </span>
                            <Sparkles size={20} className="text-purple-200" />
                        </div>
                        <h3 className="text-3xl font-black">
                            ₹{estimatedProfit > 0 ? estimatedProfit.toLocaleString() : 0}
                        </h3>
                        <p className="text-xs text-purple-100">
                            {totalInvestment > 0
                                ? `~${Math.round((estimatedProfit / totalInvestment) * 100)}% return on investment`
                                : "Profit margin"}
                        </p>
                    </div>
                </div>

                {/* Top Valued Products Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Top Valued Inventory Items</h3>
                            <p className="text-xs text-slate-400">Products contributing highest capital value to inventory</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Valuation Ranking</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    <th className="py-3 px-5">Product Name</th>
                                    <th className="py-3 px-4">Selling Price</th>
                                    <th className="py-3 px-4">Cost Price</th>
                                    <th className="py-3 px-4">Stock Units</th>
                                    <th className="py-3 px-4">Unit Margin</th>
                                    <th className="py-3 px-5 text-right">Total Worth</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                                {activeMedicines
                                    .slice()
                                    .sort(
                                        (a, b) =>
                                            (b.sellingPrice || 0) * (b.stock || 0) -
                                            (a.sellingPrice || 0) * (a.stock || 0)
                                    )
                                    .slice(0, 5)
                                    .map((med) => {
                                        const unitMargin = (med.sellingPrice || 0) - (med.purchasePrice || 0);
                                        const totalWorth = (med.sellingPrice || 0) * (med.stock || 0);

                                        return (
                                            <tr
                                                key={med._id}
                                                onClick={() => navigate(`/medicines/${med._id}`)}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                                            >
                                                <td className="py-3.5 px-5 font-extrabold text-slate-900 dark:text-white">
                                                    {med.name}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                                                    ₹{med.sellingPrice || 0}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-500">
                                                    ₹{med.purchasePrice || 0}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                                                    {med.stock || 0} units
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                                        +₹{unitMargin > 0 ? unitMargin.toFixed(2) : 0}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-5 text-right font-black text-slate-900 dark:text-white text-sm">
                                                    ₹{totalWorth.toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {openAddModal && <MedicineFormModal setOpenModal={setOpenAddModal} />}
            {openSaleModal && (
                <SaleFormModal
                    setOpenModal={setOpenSaleModal}
                    medicines={activeMedicines}
                    onAddSale={handleAddSale}
                />
            )}
            {openReportsModal && (
                <ReportsModal
                    setOpenModal={setOpenReportsModal}
                    medicines={medicines}
                    brands={brands}
                    categories={categories}
                    sales={sales}
                />
            )}
        </div>
    );
};

export default Dashboard;
