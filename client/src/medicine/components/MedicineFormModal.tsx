import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useForm } from "react-hook-form";
import type { IMedicine } from '../../types/medicine';
import useMedicineOperations from '../hooks/useMedicineOperations';
import { medicineSchema } from '../validation/medicineSchema';

const MedicineFormModal = ({ setOpenModal, medicineData }:
    { setOpenModal: Dispatch<SetStateAction<boolean>>, medicineData?: IMedicine }
) => {
    const isUpdate = !!medicineData

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } =
        useForm<IMedicine>({
            resolver: zodResolver(medicineSchema),
            mode: "onChange",
            defaultValues: medicineData
        });
    const { createMedicine, updateMedicine } = useMedicineOperations()

    const onSubmit = async (data: IMedicine) => {
        if (isUpdate) {
            await updateMedicine(data)
        } else {
            await createMedicine(data)
        }
        setOpenModal(false)
    }

    useEffect(() => {
        if (!medicineData) return

        reset({
            ...medicineData,
            expiry: new Date(medicineData.expiry),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <form className="p-4 sm:p-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800">{isUpdate ? "Update" : "Add"} Medicine</h3>
                        <button onClick={() => setOpenModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1"
                                htmlFor="name"
                            >Medicine Name</label>
                            <input
                                {...register("name")}
                                placeholder="e.g. Paracetamol"
                                className="w-full border rounded-lg p-2"
                            />
                            {errors.name &&
                                <span className="text-xs text-red-500">{errors.name.message}</span>
                            }
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1"
                                    htmlFor="cost"
                                >Cost (₹)
                                </label>
                                <input
                                    type="number"
                                    {...register("cost", {
                                        valueAsNumber: true
                                    })}
                                    className="w-full p-2 border rounded-lg outline-none "
                                />
                                {errors.cost && (
                                    <span className="text-xs text-red-500">{errors.cost.message}</span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1"
                                    htmlFor="gst"
                                >GST (%)
                                </label>
                                <input
                                    type="number"
                                    {...register("gst", { valueAsNumber: true })}
                                    className="w-full p-2 border rounded-lg outline-none "
                                />
                                {errors.gst && (
                                    <span className="text-xs text-red-500">
                                        {errors.gst.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1"
                                    htmlFor="discount"
                                >Discount (%)
                                </label>
                                <input
                                    type="number"
                                    {...register("discount", { valueAsNumber: true })}
                                    className="w-full p-2 border rounded-lg outline-none "
                                />
                                {errors.discount && (
                                    <span className="text-xs text-red-500">
                                        {errors.discount.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1"
                                    htmlFor="expiry">Expiry Date</label>
                                <input
                                    type="date"
                                    {...register("expiry", {
                                        valueAsDate: true
                                    })}
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.expiry && (
                                    <span className="text-xs text-red-500">{errors.expiry.message}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1"
                                htmlFor="description"
                            >Description</label>
                            <textarea
                                {...register("description")}
                                placeholder="e.g. Paracetamol"
                                className="w-full border rounded-lg p-2"
                            />
                            {errors.name &&
                                <span className="text-xs text-red-500">{errors.name.message}</span>
                            }
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="p-6 bg-slate-50 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setOpenModal(false)}
                            className="flex-1 font-bold text-slate-600 border rounded-lg cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer">
                            <Save size={18} />
                            {isUpdate ? "Update" : "Add"} Medicine
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MedicineFormModal
