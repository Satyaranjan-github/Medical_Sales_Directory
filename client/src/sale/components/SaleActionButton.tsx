import { Edit, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ISale } from "../../types/sale";
import useSaleOperations from "../hooks/useSaleOperations";
import SaleModal from "./SaleModal";

interface SaleActionButtonProps {
    saleData: ISale;
    refetch?: () => void;
}

const SaleActionButton = ({ saleData, refetch }: SaleActionButtonProps) => {
    const [openModal, setOpenModal] = useState(false);
    const { deleteSale, restoreSale, deleteSalePermanently } = useSaleOperations();

    const isDeleted = saleData.isDeleted;

    const handleDelete = async () => {
        if (!saleData._id) return;
        if (window.confirm("Soft delete this sale record? Inventory stock will be replenished.")) {
            await deleteSale(saleData._id);
            if (refetch) refetch();
        }
    };

    const handleRestore = async () => {
        if (!saleData._id) return;
        await restoreSale(saleData._id);
        if (refetch) refetch();
    };

    const handlePermanentDelete = async () => {
        if (!saleData._id) return;
        if (window.confirm("CRITICAL WARNING: Permanently delete this sale record? This action cannot be undone.")) {
            await deleteSalePermanently(saleData._id);
            if (refetch) refetch();
        }
    };

    return (
        <>
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sale Operations</h4>
                        <p className="text-xs text-slate-400">Modify sale details or archive/restore sale billing record.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* DELETE / RESTORE BUTTON */}
                        {isDeleted ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePermanentDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                    Delete Sale Permanently
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRestore}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                                >
                                    <RotateCcw size={16} />
                                    Restore Sale
                                </button>
                            </>
                        ) : (
                            <>
                                {/* UPDATE BUTTON */}
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                                >
                                    <Edit size={16} className="text-slate-500 dark:text-slate-400" />
                                    Update Sale
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200/60 dark:border-rose-900/60 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                    Delete Sale
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* UPDATE MODAL */}
            {openModal && <SaleModal setOpenModal={setOpenModal} saleData={saleData} />}
        </>
    );
};

export default SaleActionButton;
