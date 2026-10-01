import { ArrowLeft, Boxes, MapPin, Tag, Layers } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { IStock } from "../../types/stock";
import { useGetStockByIdQuery } from "../api/stockApi";

export const Stock = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: stockRes, isLoading } = useGetStockByIdQuery(id || "", { skip: !id });

    const stock: IStock | null = stockRes?.data || null;

    if (isLoading) {
        return (
            <div className="p-8 text-center text-xs font-bold text-slate-400 animate-pulse">
                Loading stock item details...
            </div>
        );
    }

    if (!stock) {
        return (
            <div className="p-8 text-center space-y-3">
                <Boxes size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">Stock Record Not Found</h3>
                <button
                    onClick={() => navigate("/stocks")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                    Back to Stocks
                </button>
            </div>
        );
    }

    const med = typeof stock.medicine === "object" ? (stock.medicine as any) : null;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate("/stocks")}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
                <ArrowLeft size={16} />
                <span>Back to Stock Inventory</span>
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <Boxes size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                                {med?.name || "Stock Item Details"}
                            </h1>
                            <p className="text-xs text-slate-400">ID: {stock._id}</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {stock.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                        <span className="text-xs text-slate-400 block font-bold">Quantity</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{stock.quantity}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                        <span className="text-xs text-slate-400 block font-bold">Min Alert Threshold</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{stock.minStockLevel}</span>
                    </div>
                </div>

                <div className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <span className="flex items-center gap-2 text-slate-400">
                            <MapPin size={16} /> Location
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{stock.location || "Main Store"}</span>
                    </div>
                    {med && (
                        <>
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="flex items-center gap-2 text-slate-400">
                                    <Tag size={16} /> Brand
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">{med.brand?.name || "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="flex items-center gap-2 text-slate-400">
                                    <Layers size={16} /> Category
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">{med.category?.name || "N/A"}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stock;
