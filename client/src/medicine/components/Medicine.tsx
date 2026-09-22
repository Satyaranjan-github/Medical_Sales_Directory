import { format } from "date-fns";
import {
    BookOpen,
    ClockPlus,
    Fingerprint,
    FolderPen,
    Hourglass,
    IndianRupee,
    Notebook,
    Percent,
    Tag,
    Layers,
    Boxes,
    ShoppingBag
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { IBrand } from "../../types/brand";
import type { ICategory } from "../../types/category";
import type { IMedicine } from "../../types/medicine";
import { useGetMedicineByIdQuery } from "../api/medicineApi";
import { useGetSalesByMedicineQuery } from "../../sale/api/saleApi";
import MedicineActionButton from "./MedicineActionButton";

const Medicine = () => {
    const { id: medicineId } = useParams();
    const { data: medicine, isLoading, isError } = useGetMedicineByIdQuery(medicineId as string);

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-spinner text-primary">Loading medicine details...</span>
            </div>
        );
    }

    if (isError || !medicine) {
        return <div className="p-10 text-red-500 font-semibold">Medicine not found!</div>;
    }

    return (
        <div className="p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            <BasicInformation medicineData={medicine.data} />
            <SalesHistoryForMedicine medicineId={medicineId as string} />
            <AdditionalInformation medicineData={medicine.data} />
            <MedicineActionButton medicineData={medicine.data} />
        </div>
    );
};

const SalesHistoryForMedicine = ({ medicineId }: { medicineId: string }) => {
    const { data: salesRes, isLoading } = useGetSalesByMedicineQuery({ medicineId });
    const sales = salesRes?.data || [];

    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex gap-2.5 items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 font-extrabold">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                        <ShoppingBag size={22} />
                    </div>
                    <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                        Sales History for this Medicine
                    </h3>
                </div>
                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/60 px-3 py-1 rounded-full border border-green-200/50 dark:border-green-800/50">
                    {sales.length} Sales Transactions
                </span>
            </div>

            {isLoading ? (
                <p className="text-xs text-slate-400">Loading sales records for this medicine...</p>
            ) : sales.length === 0 ? (
                <p className="text-xs text-slate-400">No sales recorded for this medicine yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                <th className="py-2.5 px-4">Receipt ID</th>
                                <th className="py-2.5 px-4">Customer</th>
                                <th className="py-2.5 px-4">Qty Sold</th>
                                <th className="py-2.5 px-4">Unit Price</th>
                                <th className="py-2.5 px-4">Mode</th>
                                <th className="py-2.5 px-4 text-right">Total Bill</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                            {sales.map((sale) => {
                                const medicineItem = sale.medicines?.find((m) => {
                                    const medId = typeof m.medicine === "object" ? (m.medicine as IMedicine)?._id : m.medicine;
                                    return medId === medicineId;
                                });

                                return (
                                    <tr key={sale._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60">
                                        <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                                            #{sale._id?.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <strong className="block text-slate-800 dark:text-slate-200">{sale.customerName}</strong>
                                            <span className="text-[10px] text-slate-400">{sale.customerPhone}</span>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-green-600 dark:text-green-400">
                                            {medicineItem?.quantity || 1} units
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">
                                            ₹{medicineItem?.unitPrice || 0}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                                                {sale.paymentMode}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                                            ₹{sale.totalAmount?.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default Medicine;

interface MedicineDataProps {
    medicineData: IMedicine;
}

const AdditionalInformation = ({ medicineData }: MedicineDataProps) => {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            {/* Header Section */}
            <div className="flex gap-2.5 items-center pb-3 border-b border-slate-100 dark:border-slate-800 font-extrabold">
                <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                    <BookOpen size={22} />
                </div>
                <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                    Additional Information
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <ClockPlus className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Created At</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {medicineData.createdAt ? format(new Date(medicineData.createdAt), "dd-MM-yyyy") : "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <ClockPlus className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Updated At</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {medicineData.updatedAt ? format(new Date(medicineData.updatedAt), "dd-MM-yyyy") : "N/A"}
                        </p>
                    </div>
                </div>

                {medicineData.deletedAt && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-rose-950/50 text-red-500 dark:text-rose-400 mt-0.5">
                            <ClockPlus className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Deleted At</p>
                            <p className="text-sm font-bold text-red-700 dark:text-rose-300 mt-0.5">
                                {format(new Date(medicineData.deletedAt), "dd-MM-yyyy")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const BasicInformation = ({ medicineData }: MedicineDataProps) => {
    const brandObj = typeof medicineData.brand === "object" ? (medicineData.brand as IBrand) : null;
    const categoryObj = typeof medicineData.category === "object" ? (medicineData.category as ICategory) : null;

    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Header Section */}
            <div className="flex gap-2.5 items-center pb-3 border-b border-slate-100 dark:border-slate-800 font-extrabold">
                <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                    <Fingerprint size={22} />
                </div>
                <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                    Basic Information
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Medicine Name */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <FolderPen className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine Name</p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {medicineData.name}
                        </p>
                    </div>
                </div>

                {/* Purchase Price */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <IndianRupee className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchase Price</p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            ₹{medicineData.purchasePrice}
                        </p>
                    </div>
                </div>

                {/* Selling Price */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <IndianRupee className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selling Price</p>
                        <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                            ₹{medicineData.sellingPrice}
                        </p>
                    </div>
                </div>

                {/* GST */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <Percent className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">GST Rate</p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {medicineData.gst}%
                        </p>
                    </div>
                </div>

                {/* Stock Level */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <Boxes className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory Stock</p>
                        <div className="mt-0.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold ${(medicineData.stock ?? 0) <= 10
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                                : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800"
                                }`}>
                                {medicineData.stock ?? 0} units
                            </span>
                        </div>
                    </div>
                </div>

                {/* Batch Number */}
                {medicineData.batchNumber && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                            <Tag className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batch Number</p>
                            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                                {medicineData.batchNumber}
                            </p>
                        </div>
                    </div>
                )}

                {/* Expiry Date */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <Hourglass className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry Date</p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {medicineData.expiry ? format(new Date(medicineData.expiry), "dd-MM-yyyy") : "N/A"}
                        </p>
                    </div>
                </div>

                {/* Brand Link */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <Tag className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand</p>
                        {brandObj ? (
                            <Link
                                to={`/brands/${brandObj._id}`}
                                className="text-base font-extrabold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline mt-0.5 inline-block"
                            >
                                {brandObj.name}
                            </Link>
                        ) : (
                            <p className="text-base font-semibold text-slate-400 mt-0.5">N/A</p>
                        )}
                    </div>
                </div>

                {/* Category Link */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <Layers className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
                        {categoryObj ? (
                            <Link
                                to={`/categories/${categoryObj._id}`}
                                className="text-base font-extrabold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline mt-0.5 inline-block"
                            >
                                {categoryObj.name}
                            </Link>
                        ) : (
                            <p className="text-base font-semibold text-slate-400 mt-0.5">N/A</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 pt-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                    <Notebook className="size-5" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {medicineData.description || "No description provided."}
                    </p>
                </div>
            </div>
        </section>
    );
};