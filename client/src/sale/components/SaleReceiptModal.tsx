import { CheckCircle2, Printer, X } from "lucide-react";
import type { ISale } from "../../types/sale";
import type { IMedicine } from "../../types/medicine";

interface SaleReceiptModalProps {
    sale: ISale;
    setOpenModal: (open: boolean) => void;
}

const SaleReceiptModal = ({ sale, setOpenModal }: SaleReceiptModalProps) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">
                {/* HEADER */}
                <header className="p-4 sm:p-5 bg-green-600 text-white flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/20 text-white">
                            <CheckCircle2 size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black leading-none">
                                Sales Invoice Receipt
                            </h3>
                            <p className="text-xs text-green-100 mt-1">
                                Transaction ID: #{sale._id?.slice(-8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </header>

                {/* RECEIPT CONTENT */}
                <main className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800 dark:text-slate-200">
                    {/* Customer & Date Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                        <div>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Billed To</span>
                            <strong className="text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">
                                {sale.customerName}
                            </strong>
                            <span className="text-slate-500 font-medium block">{sale.customerPhone}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Transaction Date</span>
                            <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                                {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }) : "N/A"}
                            </strong>
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/80 px-2 py-0.5 rounded-full mt-1">
                                {sale.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {/* Medicines List */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Medicine Items</span>
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {sale.medicines?.map((item, idx) => {
                                const medName = typeof item.medicine === "object" ? (item.medicine as IMedicine).name : "Medicine Item";
                                return (
                                    <div key={idx} className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                                        <div>
                                            <strong className="font-extrabold text-slate-900 dark:text-white block">
                                                {medName}
                                            </strong>
                                            <span className="text-[11px] text-slate-400">
                                                {item.quantity} units × ₹{item.unitPrice}
                                            </span>
                                        </div>
                                        <div className="font-black text-slate-900 dark:text-white text-sm">
                                            ₹{item.totalPrice.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary Totals */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-500">
                            <span>SubTotal:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">₹{sale.subTotal?.toLocaleString()}</span>
                        </div>
                        {sale.discount > 0 && (
                            <div className="flex justify-between text-slate-500">
                                <span>Discount:</span>
                                <span className="font-bold text-rose-500">-₹{sale.discount?.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                            <span className="font-black text-sm text-slate-900 dark:text-white">Total Bill Paid:</span>
                            <span className="font-black text-xl text-green-600 dark:text-green-400">₹{sale.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Payment Mode: <strong>{sale.paymentMode}</strong></span>
                            {sale.notes && <span>Notes: {sale.notes}</span>}
                        </div>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="py-2.5 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <Printer size={16} /> Print Receipt
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SaleReceiptModal;
