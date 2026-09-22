import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle,
    Calendar,
    CreditCard,
    FileText,
    IndianRupee,
    Minus,
    Phone,
    Pill,
    Plus,
    Save,
    ShoppingBag,
    Trash2,
    User,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MedicineSelect from "../../medicine/components/MedicineSelect";
import type { IMedicine } from "../../types/medicine";
import { PaymentMode, PaymentStatus, type ISale } from "../../types/sale";
import useSaleOperations from "../hooks/useSaleOperations";
import { saleSchema } from "../validation/saleSchema";

interface SaleModalProps {
    setOpenModal: (open: boolean) => void;
    saleData?: ISale;
}

interface AddedMedicineItem {
    medicineId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    stock?: number;
}

const SaleModal = ({ setOpenModal, saleData }: SaleModalProps) => {
    const isUpdate = !!saleData;
    const { createSale, updateSale } = useSaleOperations();

    // State for Add Medicine section
    const [selectedMedId, setSelectedMedId] = useState<string>("");
    const [selectedMed, setSelectedMed] = useState<IMedicine | undefined>(undefined);
    const [addQuantity, setAddQuantity] = useState<number>(1);
    const [addError, setAddError] = useState<string>("");

    // Selected medicines list state
    const [addedMedicines, setAddedMedicines] = useState<AddedMedicineItem[]>(() => {
        if (!saleData?.medicines) return [];
        return saleData.medicines.map((item) => {
            const isObj = typeof item.medicine === "object" && item.medicine !== null;
            const medObj = isObj ? (item.medicine as IMedicine) : undefined;
            const medicineId = isObj ? medObj?._id || "" : (item.medicine as string);
            const name = medObj?.name || "Medicine Item";
            return {
                medicineId,
                name,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                stock: medObj?.stock,
            };
        });
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(saleSchema),
        mode: "onChange",
        defaultValues: {
            customerName: saleData?.customerName || "",
            customerPhone: saleData?.customerPhone || "",
            saleDate: saleData?.saleDate ? new Date(saleData.saleDate) : new Date(),
            discount: saleData?.discount || 0,
            paymentMode: saleData?.paymentMode as PaymentMode,
            paymentStatus: saleData?.paymentStatus as PaymentStatus,
            notes: saleData?.notes || "",
            medicines: addedMedicines.map((m) => ({
                medicine: m.medicineId,
                quantity: m.quantity,
                unitPrice: m.unitPrice,
                totalPrice: m.totalPrice,
            })),
            subTotal: saleData?.subTotal || 0,
            totalAmount: saleData?.totalAmount || 0,
        }
    });

    const discountValue = watch("discount") || 0;

    // Calculate subtotal & total amount
    const subTotal = addedMedicines.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalAmount = Math.max(0, subTotal - Number(discountValue || 0));

    // Keep react-hook-form values in sync whenever addedMedicines, subTotal or totalAmount change
    useEffect(() => {
        const formattedMeds = addedMedicines.map((m) => ({
            medicine: m.medicineId,
            quantity: m.quantity,
            unitPrice: m.unitPrice,
            totalPrice: m.totalPrice,
        }));
        setValue("medicines", formattedMeds, { shouldValidate: true });
        setValue("subTotal", subTotal, { shouldValidate: true });
        setValue("totalAmount", totalAmount, { shouldValidate: true });
    }, [addedMedicines, subTotal, totalAmount, setValue]);

    // Handle Medicine Select Change
    const handleMedicineSelect = (medicineId: string, medicine?: IMedicine) => {
        setSelectedMedId(medicineId);
        setSelectedMed(medicine);
        setAddError("");
    };

    // Handle Add Button Click
    const handleAddMedicine = () => {
        if (!selectedMedId || !selectedMed) {
            setAddError("Please select a medicine from the dropdown");
            return;
        }

        const qty = Number(addQuantity);
        if (isNaN(qty) || qty <= 0) {
            setAddError("Please enter a valid quantity of at least 1");
            return;
        }

        if (selectedMed.stock !== undefined && qty > selectedMed.stock) {
            setAddError(`Only ${selectedMed.stock} items available in stock`);
            return;
        }

        const unitPrice = selectedMed.sellingPrice || 0;

        setAddedMedicines((prev) => {
            const existingIndex = prev.findIndex((item) => item.medicineId === selectedMedId);
            if (existingIndex > -1) {
                // Update existing item
                const updated = [...prev];
                const newQty = updated[existingIndex].quantity + qty;
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQty,
                    totalPrice: newQty * unitPrice,
                };
                return updated;
            } else {
                // Add new item
                return [
                    ...prev,
                    {
                        medicineId: selectedMedId,
                        name: selectedMed.name,
                        unitPrice,
                        quantity: qty,
                        totalPrice: qty * unitPrice,
                        stock: selectedMed.stock,
                    }
                ];
            }
        });

        // Reset Add inputs
        setSelectedMedId("");
        setSelectedMed(undefined);
        setAddQuantity(1);
        setAddError("");
    };

    // Handle Quantity Change in List
    const handleUpdateQuantity = (medicineId: string, newQty: number) => {
        if (newQty <= 0) {
            handleRemoveMedicine(medicineId);
            return;
        }

        setAddedMedicines((prev) =>
            prev.map((item) => {
                if (item.medicineId === medicineId) {
                    return {
                        ...item,
                        quantity: newQty,
                        totalPrice: newQty * item.unitPrice,
                    };
                }
                return item;
            })
        );
    };

    // Handle Remove Medicine from List
    const handleRemoveMedicine = (medicineId: string) => {
        setAddedMedicines((prev) => prev.filter((item) => item.medicineId !== medicineId));
    };

    // Submit Handler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        if (addedMedicines.length === 0) {
            setAddError("Please add at least one medicine item to record this sale");
            return;
        }

        const payload: Partial<ISale> = {
            customerName: data.customerName,
            customerPhone: data.customerPhone || "",
            saleDate: data.saleDate ? new Date(data.saleDate) : new Date(),
            medicines: addedMedicines.map((m) => ({
                medicine: m.medicineId,
                quantity: m.quantity,
                unitPrice: m.unitPrice,
                totalPrice: m.totalPrice,
            })),
            subTotal,
            discount: Number(data.discount || 0),
            totalAmount,
            paymentMode: data.paymentMode || PaymentMode.UPI,
            paymentStatus: data.paymentStatus || PaymentStatus.PAID,
            notes: data.notes || "",
        };

        if (isUpdate && saleData?._id) {
            await updateSale(saleData._id, payload);
        } else {
            await createSale(payload);
        }

        setOpenModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
            {/* MODAL DIALOG CONTAINER */}
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800 transition-all duration-300 animate-in zoom-in-95 duration-200">

                {/* 1. HEADER */}
                <header className="p-4 sm:p-5.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-xs transition-colors duration-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                {isUpdate ? "Update Sale Transaction" : "Record New Sale (POS)"}
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                {isUpdate ? "Modify bill details & item quantities" : "Select medicines, set quantities & issue customer bill"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </header>

                {/* 2. SCROLLABLE MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto">
                    <form id="sale-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                        {/* SECTION 1: CUSTOMER IDENTIFICATION */}
                        <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <User size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                    Customer & Transaction Details
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Customer Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="customerName">
                                        Customer Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="customerName"
                                            type="text"
                                            {...register("customerName")}
                                            placeholder="e.g. John Doe"
                                            className={`w-full text-xs font-semibold pl-10 pr-3 py-2.5 rounded-xl border outline-none transition-all ${errors.customerName
                                                ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:border-rose-500"
                                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                        />
                                    </div>
                                    {errors.customerName && (
                                        <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1 font-bold">
                                            <AlertCircle size={12} />
                                            {errors.customerName.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Customer Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="customerPhone">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="customerPhone"
                                            type="text"
                                            {...register("customerPhone")}
                                            placeholder="e.g. 9876543210"
                                            className="w-full text-xs font-semibold pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>

                                {/* Sale Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="saleDate">
                                        Sale Date
                                    </label>
                                    <div className="relative">
                                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                                        <input
                                            id="saleDate"
                                            type="date"
                                            {...register("saleDate")}
                                            className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: ADD MEDICINE SECTION */}
                        <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50 dark:border-emerald-900/40">
                                <div className="flex items-center gap-2">
                                    <Pill size={16} className="text-emerald-600 dark:text-emerald-400" />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                        Add Medicine to Sale
                                    </h4>
                                </div>
                                {selectedMed && (
                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                                        Unit Price: ₹{selectedMed.sellingPrice} | Stock: {selectedMed.stock ?? 0}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                {/* Medicine Selector */}
                                <div className="sm:col-span-7">
                                    <MedicineSelect
                                        value={selectedMedId}
                                        onChange={handleMedicineSelect}
                                        label="Select Medicine"
                                        required
                                    />
                                </div>

                                {/* Quantity Input */}
                                <div className="sm:col-span-3">
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                        Quantity <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={addQuantity}
                                        onChange={(e) => setAddQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Add Button */}
                                <div className="sm:col-span-2">
                                    <button
                                        type="button"
                                        onClick={handleAddMedicine}
                                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer h-[34px]"
                                    >
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </div>

                            {/* Add Error Message */}
                            {addError && (
                                <p className="flex items-center gap-1 text-[11px] text-rose-500 font-bold mt-1">
                                    <AlertCircle size={12} />
                                    {addError}
                                </p>
                            )}
                            {errors.medicines && (
                                <p className="flex items-center gap-1 text-[11px] text-rose-500 font-bold mt-1">
                                    <AlertCircle size={12} />
                                    {errors.medicines.message as string}
                                </p>
                            )}
                        </div>

                        {/* SECTION 3: MEDICINE LISTS DISPLAYED BELOW THE SECTION */}
                        <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={16} className="text-emerald-600 dark:text-emerald-400" />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                        Selected Medicines List ({addedMedicines.length})
                                    </h4>
                                </div>
                                <span className="text-xs font-bold text-slate-500">
                                    Subtotal: <strong className="text-slate-900 dark:text-white">₹{subTotal.toLocaleString()}</strong>
                                </span>
                            </div>

                            {addedMedicines.length === 0 ? (
                                <div className="p-8 text-center space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl">
                                    <Pill size={28} className="mx-auto text-slate-300 dark:text-slate-600" />
                                    <p className="text-xs font-semibold text-slate-400">
                                        No medicines added yet. Select a medicine above and click <strong className="text-emerald-600">Add</strong>.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                                                <th className="py-2.5 px-3">Medicine Name</th>
                                                <th className="py-2.5 px-3 text-right">Price (₹)</th>
                                                <th className="py-2.5 px-3 text-center">Qty</th>
                                                <th className="py-2.5 px-3 text-right">Total (₹)</th>
                                                <th className="py-2.5 px-3 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                                            {addedMedicines.map((item) => (
                                                <tr key={item.medicineId} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
                                                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                                                        {item.name}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right">
                                                        ₹{item.unitPrice.toLocaleString()}
                                                    </td>
                                                    <td className="py-2.5 px-3">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateQuantity(item.medicineId, item.quantity - 1)}
                                                                className="p-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                                            >
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="w-8 text-center font-extrabold text-slate-900 dark:text-white text-xs">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateQuantity(item.medicineId, item.quantity + 1)}
                                                                className="p-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                                                        ₹{item.totalPrice.toLocaleString()}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMedicine(item.medicineId)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* SECTION 4: FINANCIAL SUMMARY & PAYMENT DETAILS */}
                        <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                    Billing & Payment Summary
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Discount Input */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="discount">
                                        Discount (₹)
                                    </label>
                                    <div className="relative">
                                        <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="discount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...register("discount", { valueAsNumber: true })}
                                            placeholder="0.00"
                                            className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Payment Mode */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="paymentMode">
                                        Payment Mode
                                    </label>
                                    <div className="relative">
                                        <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                                        <select
                                            id="paymentMode"
                                            {...register("paymentMode")}
                                            className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                                        >
                                            {Object.values(PaymentMode).map((mode) => (
                                                <option key={mode} value={mode}>
                                                    {mode}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Payment Status */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="paymentStatus">
                                        Payment Status
                                    </label>
                                    <select
                                        id="paymentStatus"
                                        {...register("paymentStatus")}
                                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                                    >
                                        {Object.values(PaymentStatus).map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Total Payable Summary Banner */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                        Total Amount Payable
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Subtotal: ₹{subTotal.toLocaleString()} | Discount: ₹{Number(discountValue || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                                        ₹{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="notes">
                                    Notes / Comments
                                </label>
                                <div className="relative">
                                    <FileText size={15} className="absolute left-3.5 top-3 text-slate-400" />
                                    <textarea
                                        id="notes"
                                        rows={2}
                                        {...register("notes")}
                                        placeholder="Add invoice notes or special instructions..."
                                        className="w-full text-xs font-semibold pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </main>

                {/* 3. FOOTER */}
                <footer className="p-4 sm:p-5.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky bottom-0 z-20 shadow-xs transition-colors duration-200 shrink-0">
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="flex-1 py-3 px-4 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer text-sm mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="sale-form"
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                        <Save size={18} />
                        {isUpdate ? "Save Sale Record" : "Complete & Save Sale"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SaleModal;
