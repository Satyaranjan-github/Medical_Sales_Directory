import { Boxes, Calendar, MapPin, Notebook, Pill, Tag, Layers, Percent, X } from "lucide-react";
import type { IStock } from "../../types/stock";

interface Props {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    stock: IStock | null;
}

export const StockDetailsModal = ({ openModal, setOpenModal, stock }: Props) => {
    if (!openModal || !stock) return null;

    const med = typeof stock.medicine === "object" ? (stock.medicine as any) : null;
    const brandName = med?.brand?.name || "N/A";
    const categoryName = med?.category?.name || "N/A";
    const marginTitle = med?.margin ? `${med.margin.title} (${med.margin.value}%)` : "N/A";

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "IN_STOCK":
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        In Stock
                    </span>
                );
            case "LOW_STOCK":
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Low Stock Alert
                    </span>
                );
            case "OUT_OF_STOCK":
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Out of Stock
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <Boxes size={22} />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                Stock Inventory Details
                            </h3>
                            <p className="text-xs font-semibold text-slate-400">
                                Detailed stock record and medicine mapping
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {/* Medicine Header Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Pill size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                    {med?.name || "Medicine"}
                                </span>
                            </div>
                            {getStatusBadge(stock.status)}
                        </div>
                        {med?.batchNumber && (
                            <p className="text-[11px] font-mono text-slate-400">
                                Batch: {med.batchNumber}
                            </p>
                        )}
                    </div>

                    {/* Stock Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Quantity</span>
                            <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">{stock.quantity} Units</span>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Min Alert Threshold</span>
                            <span className="text-lg font-black text-amber-700 dark:text-amber-400">{stock.minStockLevel} Units</span>
                        </div>
                    </div>

                    {/* Metadata Items */}
                    <div className="space-y-2.5 pt-2">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <MapPin size={14} /> Storage Location:
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{stock.location || "Main Store"}</span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Tag size={14} /> Brand:
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{brandName}</span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Layers size={14} /> Category:
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{categoryName}</span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Percent size={14} /> Margin:
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{marginTitle}</span>
                        </div>

                        {stock.notes && (
                            <div className="pt-1">
                                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                                    <Notebook size={14} /> Notes:
                                </span>
                                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs italic">
                                    "{stock.notes}"
                                </p>
                            </div>
                        )}

                        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} /> Added: {stock.createdAt ? new Date(stock.createdAt).toLocaleDateString() : "N/A"}
                            </span>
                            <span>
                                Updated: {stock.updatedAt ? new Date(stock.updatedAt).toLocaleDateString() : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockDetailsModal;
