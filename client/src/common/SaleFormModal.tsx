import {
    AlertCircle,
    CheckCircle2,
    CreditCard,
    Pill,
    ShoppingBag,
    User,
    X
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { IMedicine } from "../types/medicine";

export interface ISaleRecord {
    id: string;
    customerName: string;
    customerPhone: string;
    medicineName: string;
    medicineId: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    discount: number;
    paymentMode: "UPI" | "CASH" | "CREDIT CARD" | "DEBIT CARD" | "NET BANKING";
    paymentStatus: "PAID" | "UNPAID" | "PARTIALLY PAID";
    date: string;
}

const SaleFormModal = ({
    setOpenModal,
    medicines,
    onAddSale
}: {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    medicines: IMedicine[];
    onAddSale: (sale: ISaleRecord) => void;
}) => {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [selectedMedId, setSelectedMedId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [paymentMode, setPaymentMode] = useState<ISaleRecord["paymentMode"]>("UPI");
    const [paymentStatus, setPaymentStatus] = useState<ISaleRecord["paymentStatus"]>("PAID");
    const [error, setError] = useState("");

    const selectedMedicine = medicines.find((m) => m._id === selectedMedId);
    const unitPrice = selectedMedicine?.sellingPrice || 0;
    const subTotal = unitPrice * quantity;
    const totalAmount = Math.max(0, subTotal - discount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMedId) {
            setError("Please select a medicine for this sale.");
            return;
        }
        if (!customerName.trim()) {
            setError("Please enter customer name.");
            return;
        }
        if (quantity < 1) {
            setError("Quantity must be at least 1.");
            return;
        }
        if (selectedMedicine && (selectedMedicine.stock ?? 0) < quantity) {
            setError(`Insufficient stock! Only ${selectedMedicine.stock ?? 0} units available.`);
            return;
        }

        const newSale: ISaleRecord = {
            id: `SALE-${Date.now().toString().slice(-6)}`,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim() || "-",
            medicineName: selectedMedicine?.name || "Medicine",
            medicineId: selectedMedId,
            quantity,
            unitPrice,
            totalAmount,
            discount,
            paymentMode,
            paymentStatus,
            date: new Date().toISOString()
        };

        onAddSale(newSale);
        setOpenModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 transition-all duration-300">
                {/* HEADER */}
                <header className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                Record New Sale
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">
                                Create POS transaction entry & deduct inventory
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

                {/* FORM CONTENT */}
                <main className="flex-1 overflow-y-auto p-6 space-y-5">
                    {error && (
                        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form id="sale-form" onSubmit={handleSubmit} className="space-y-4">
                        {/* CUSTOMER DETAILS */}
                        <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <User size={14} className="text-blue-500" /> Customer Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Customer Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="e.g. Rajesh Kumar"
                                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="+91 9876543210"
                                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PRODUCT SELECTION */}
                        <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <Pill size={14} className="text-blue-500" /> Select Product
                            </h4>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Medicine <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={selectedMedId}
                                    onChange={(e) => {
                                        setSelectedMedId(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="">-- Select Medicine --</option>
                                    {medicines
                                        .filter((m) => !m.isDeleted)
                                        .map((m) => (
                                            <option key={m._id} value={m._id}>
                                                {m.name} — ₹{m.sellingPrice || 0} ({m.stock ?? 0} in stock)
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Discount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={discount}
                                        onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT DETAILS */}
                        <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <CreditCard size={14} className="text-blue-500" /> Payment & Settlement
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Payment Mode
                                    </label>
                                    <select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value as ISaleRecord["paymentMode"])}
                                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="UPI">UPI / GPay / PhonePe</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CREDIT CARD">Credit Card</option>
                                        <option value="DEBIT CARD">Debit Card</option>
                                        <option value="NET BANKING">Net Banking</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Payment Status
                                    </label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value as ISaleRecord["paymentStatus"])}
                                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="PAID">Paid</option>
                                        <option value="UNPAID">Unpaid</option>
                                        <option value="PARTIALLY PAID">Partially Paid</option>
                                    </select>
                                </div>
                            </div>

                            {/* TOTAL BREAKDOWN */}
                            <div className="pt-2 border-t border-blue-200/40 dark:border-blue-900/40 flex items-center justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Bill:</span>
                                <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                                    ₹{totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </form>
                </main>

                {/* FOOTER */}
                <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky bottom-0 shrink-0">
                    <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="py-2.5 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="sale-form"
                        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <CheckCircle2 size={16} /> Complete Sale
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SaleFormModal;
