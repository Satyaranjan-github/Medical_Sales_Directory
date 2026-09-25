import {
    BarChart3,
    Layers,
    Printer,
    Tag,
    X
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { IBrand } from "../types/brand";
import type { ICategory } from "../types/category";
import type { IMedicine } from "../types/medicine";
import type { ISale } from "../types/sale";

interface ReportsModalProps {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    medicines: IMedicine[];
    brands: IBrand[];
    categories: ICategory[];
    sales: ISale[];
}

const ReportsModal = ({
    setOpenModal,
    medicines,
    brands,
    categories,
    sales
}: ReportsModalProps) => {
    const activeMedicines = medicines.filter((m) => !m.isDeleted);
    const totalInventoryValue = activeMedicines.reduce(
        (acc, m) => acc + (m.sellingPrice || 0) * (m.stock || 0),
        0
    );
    const totalInvestment = activeMedicines.reduce(
        (acc, m) => acc + (m.purchasePrice || 0) * (m.stock || 0),
        0
    );
    const estMargin = totalInventoryValue - totalInvestment;

    const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const lowStockItems = activeMedicines.filter((m) => (m.stock ?? 0) <= 10);
    const expiringSoonItems = activeMedicines.filter((m) => {
        if (!m.expiry) return false;
        const exp = new Date(m.expiry);
        return exp > now && exp <= thirtyDaysFromNow;
    });
    const expiredItems = activeMedicines.filter((m) => {
        if (!m.expiry) return false;
        return new Date(m.expiry) <= now;
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 transition-all duration-300">
                {/* HEADER */}
                <header className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                            <BarChart3 size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                Executive Inventory & Sales Report
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                Comprehensive audit, valuation breakdown, and stock health statement
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                        >
                            <Printer size={14} /> Print Report
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpenModal(false)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </header>

                {/* SCROLLABLE REPORT CONTENT */}
                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* KEY HIGHLIGHT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
                            <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                                Inventory Valuation
                            </span>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                                ₹{totalInventoryValue.toLocaleString()}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Est. Retail Value</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                                Estimated Profit Margin
                            </span>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                                ₹{Math.max(0, estMargin).toLocaleString()}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Selling Price - Purchase Cost</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                                Recorded Sales Revenue
                            </span>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                                ₹{totalSalesRevenue.toLocaleString()}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{sales.length} transactions recorded</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                                Attention Needed
                            </span>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                                {lowStockItems.length + expiringSoonItems.length + expiredItems.length}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Low stock & expiry alerts</p>
                        </div>
                    </div>

                    {/* CATEGORY BREAKDOWN TABLE */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <Layers size={16} className="text-purple-600 dark:text-purple-400" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                Category Wise Inventory Valuation & Product Count
                            </h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                                        <th className="py-2.5 px-3">Category</th>
                                        <th className="py-2.5 px-3">Products</th>
                                        <th className="py-2.5 px-3">Total Stock Units</th>
                                        <th className="py-2.5 px-3 text-right">Valuation (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                                    {categories.map((cat) => {
                                        const catMeds = activeMedicines.filter((m) => {
                                            const catId = typeof m.category === "object" ? m.category?._id : m.category;
                                            return catId === cat._id;
                                        });
                                        const catUnits = catMeds.reduce((acc, m) => acc + (m.stock || 0), 0);
                                        const catVal = catMeds.reduce(
                                            (acc, m) => acc + (m.sellingPrice || 0) * (m.stock || 0),
                                            0
                                        );

                                        return (
                                            <tr key={cat._id}>
                                                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                                                    {cat.name}
                                                </td>
                                                <td className="py-3 px-3">{catMeds.length} items</td>
                                                <td className="py-3 px-3">{catUnits.toLocaleString()} units</td>
                                                <td className="py-3 px-3 text-right font-extrabold text-purple-700 dark:text-purple-300">
                                                    ₹{catVal.toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* BRAND BREAKDOWN TABLE */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-purple-600 dark:text-purple-400" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                Manufacturer & Brand Distribution
                            </h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                                        <th className="py-2.5 px-3">Brand Label</th>
                                        <th className="py-2.5 px-3">Products</th>
                                        <th className="py-2.5 px-3">Available Units</th>
                                        <th className="py-2.5 px-3 text-right">Valuation (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                                    {brands.map((b) => {
                                        const bMeds = activeMedicines.filter((m) => {
                                            const bId = typeof m.brand === "object" ? m.brand?._id : m.brand;
                                            return bId === b._id;
                                        });
                                        const bUnits = bMeds.reduce((acc, m) => acc + (m.stock || 0), 0);
                                        const bVal = bMeds.reduce(
                                            (acc, m) => acc + (m.sellingPrice || 0) * (m.stock || 0),
                                            0
                                        );

                                        return (
                                            <tr key={b._id}>
                                                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                                                    {b.name}
                                                </td>
                                                <td className="py-3 px-3">{bMeds.length} items</td>
                                                <td className="py-3 px-3">{bUnits.toLocaleString()} units</td>
                                                <td className="py-3 px-3 text-right font-extrabold text-purple-700 dark:text-purple-300">
                                                    ₹{bVal.toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky bottom-0 shrink-0">
                    <span className="text-xs text-slate-400">Report generated live on {new Date().toLocaleDateString()}</span>
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="py-2 px-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                        Close Report
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ReportsModal;
