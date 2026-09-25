import { format } from "date-fns";
import {
    ArrowLeft,
    CheckCircle2,
    ClockPlus,
    CreditCard,
    FileText,
    Fingerprint,
    IndianRupee,
    Pill,
    RefreshCw,
    ShoppingBag,
    User
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { IMedicine } from "../../types/medicine";
import type { ISale } from "../../types/sale";
import { useGetSaleByIdQuery } from "../api/saleApi";
import SaleActionButton from "./SaleActionButton";
import SaleReceiptModal from "./SaleReceiptModal";

const Sale = () => {
    const { id: saleId } = useParams();
    const { data: saleRes, isLoading, isError, refetch } = useGetSaleByIdQuery(saleId as string);
    const [openReceiptModal, setOpenReceiptModal] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 text-slate-400 font-semibold text-xs gap-2">
                <RefreshCw size={18} className="animate-spin text-green-600" />
                Loading sale transaction details...
            </div>
        );
    }

    if (isError || !saleRes?.data) {
        return (
            <div className="p-8 text-center space-y-3">
                <div className="p-3 w-max mx-auto rounded-2xl bg-rose-50 text-rose-500">
                    <ShoppingBag size={28} />
                </div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white">Sale record not found</h4>
                <Link to="/sales" className="py-2 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs inline-flex items-center gap-1.5">
                    <ArrowLeft size={14} /> Back to Sales Directory
                </Link>
            </div>
        );
    }

    const saleData: ISale = saleRes.data;

    return (
        <div className="p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            <BasicInformation saleData={saleData} />
            <MedicinesPurchased saleData={saleData} />
            <FinancialInformation saleData={saleData} />
            <AdditionalInformation saleData={saleData} />
            <SaleActionButton saleData={saleData} refetch={refetch} />

            {openReceiptModal && (
                <SaleReceiptModal
                    sale={saleData}
                    setOpenModal={() => setOpenReceiptModal(false)}
                />
            )}
        </div>
    );
};

export default Sale;

interface SaleDataProps {
    saleData: ISale;
}

const BasicInformation = ({ saleData }: SaleDataProps) => {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex gap-2.5 items-center pb-3 border-b border-slate-100 dark:border-slate-800 font-extrabold justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                        <Fingerprint size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                            Sale Record #{saleData._id?.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Customer transaction details & payment status
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full ${saleData.paymentStatus === "PAID"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800"
                        }`}>
                        <CheckCircle2 size={12} />
                        {saleData.paymentStatus}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Customer Name */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <User className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Name</p>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {saleData.customerName}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                            {saleData.customerPhone || "No phone provided"}
                        </p>
                    </div>
                </div>

                {/* Sale Date */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <ClockPlus className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sale Date</p>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {saleData.saleDate ? format(new Date(saleData.saleDate), "dd MMM yyyy") : "N/A"}
                        </p>
                    </div>
                </div>

                {/* Payment Mode */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <CreditCard className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Mode</p>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {saleData.paymentMode}
                        </p>
                    </div>
                </div>

                {/* Total Bill */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <IndianRupee className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bill Amount</p>
                        <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            ₹{saleData.totalAmount?.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const MedicinesPurchased = ({ saleData }: SaleDataProps) => {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex gap-2.5 items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 font-extrabold">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                        <Pill size={22} />
                    </div>
                    <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                        Purchased Medicines ({saleData.medicines?.length || 0})
                    </h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <th className="py-3 px-4">Medicine Item</th>
                            <th className="py-3 px-4 text-right">Unit Price (₹)</th>
                            <th className="py-3 px-4 text-center">Quantity</th>
                            <th className="py-3 px-4 text-right">Total Price (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {saleData.medicines?.map((m, idx) => {
                            const isObj = typeof m.medicine === "object" && m.medicine !== null;
                            const medObj = isObj ? (m.medicine as IMedicine) : undefined;
                            const name = medObj?.name || "Medicine Item";

                            return (
                                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60">
                                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                                                <Pill size={14} />
                                            </div>
                                            <span>{name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        ₹{m.unitPrice?.toLocaleString()}
                                    </td>
                                    <td className="py-3.5 px-4 text-center font-bold">
                                        {m.quantity}
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                                        ₹{m.totalPrice?.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

const FinancialInformation = ({ saleData }: SaleDataProps) => {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex gap-2.5 items-center pb-3 border-b border-slate-100 dark:border-slate-800 font-extrabold">
                <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                    <IndianRupee size={22} />
                </div>
                <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                    Financial Summary & Notes
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subtotal</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                        ₹{saleData.subTotal?.toLocaleString()}
                    </span>
                </div>
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discount</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                        ₹{saleData.discount?.toLocaleString()}
                    </span>
                </div>
                <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Total Amount</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        ₹{saleData.totalAmount?.toLocaleString()}
                    </span>
                </div>
            </div>

            {saleData.notes && (
                <div className="flex items-start gap-3 pt-2">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <FileText className="size-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Notes</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            {saleData.notes}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

const AdditionalInformation = ({ saleData }: { saleData: ISale }) => {

    return (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex gap-2.5 items-center pb-3 border-b border-slate-100 dark:border-slate-800 font-extrabold justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <ClockPlus size={22} />
                    </div>
                    <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                        Record Metadata & Actions
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <ClockPlus className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created At</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {saleData.createdAt ? format(new Date(saleData.createdAt), "dd-MM-yyyy HH:mm") : "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <ClockPlus className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Updated At</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {saleData.updatedAt ? format(new Date(saleData.updatedAt), "dd-MM-yyyy HH:mm") : "N/A"}
                        </p>
                    </div>
                </div>

                {saleData.deletedAt && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 mt-0.5">
                            <ClockPlus className="size-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Deleted At</p>
                            <p className="text-xs font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                                {format(new Date(saleData.deletedAt), "dd-MM-yyyy HH:mm")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
