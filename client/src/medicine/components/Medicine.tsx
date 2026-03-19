import { format } from "date-fns";
import { BadgePercent, BookOpen, ClockPlus, Fingerprint, FolderPen, Hourglass, IndianRupee, Notebook, Percent } from "lucide-react";
import { useParams } from "react-router-dom";
import type { IMedicine } from "../../types/medicine";
import { useGetMedicineByIdQuery } from "../api/medicineApi";
import MedicineActionButton from "./MedicineActionButton";

const Medicine = () => {
    const { id: medicineId } = useParams()
    const { data: medicine, isLoading, isError } = useGetMedicineByIdQuery(medicineId as string);

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-spinner text-primary">Loading medicine details...</span>
            </div>
        );
    }

    if (isError || !medicine) {
        return <div className="p-10 text-red-500">Medicine not found!</div>;
    }

    return (
        <div className="p-4 sm:p-6 space-y-4">
            <BasicInformation medicineData={medicine.data} />
            <AdditionalInformation medicineData={medicine.data} />
            <MedicineActionButton medicineData={medicine.data} />
        </div >
    );
}

export default Medicine

interface MedicineDataProps {
    medicineData: IMedicine
}

const AdditionalInformation = ({ medicineData }:
    MedicineDataProps
) => {
    return (
        <section className="rounded-lg border p-4 sm:p-6 border-gray-400">
            <div>
                { /* Header Section */}
                <div className="flex gap-2 items-start mb-4 font-extrabold">
                    <BookOpen size={24} className="text-green-600" />
                    <h3 className="text-xl font-extrabold leading-tight text-green-600">
                        Additional Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <div className="flex items-start gap-2 text-bold">
                        <ClockPlus className="size-5 min-w-fit" />
                        <div>
                            <p className="text-sm font-semibold">
                                Created At
                            </p>
                            <p className="text-base">
                                {medicineData.createdAt && format(medicineData.createdAt, "dd-MM-yyyy")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <ClockPlus className="size-5 min-w-fit" />
                        <div>
                            <p className="text-sm font-semibold">
                                Updated At
                            </p>
                            <p className="text-base text-text-strong">
                                {medicineData.updatedAt && format(medicineData.updatedAt, "dd-MM-yyyy")}
                            </p>
                        </div>
                    </div>
                    {medicineData.deletedAt && (
                        <div className="flex items-start gap-2">
                            <ClockPlus className="size-5 min-w-fit" />
                            <div>
                                <p className="text-sm font-semibold">
                                    Deleted At
                                </p>
                                <p className="text-base">
                                    {new Date(medicineData.deletedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

const BasicInformation = ({ medicineData }: MedicineDataProps) => {
    return (
        <section className="rounded-lg border p-4 sm:p-6 border-gray-400">
            { /* Header Section */}
            <div className="flex gap-2 items-start mb-4 font-extrabold">
                <Fingerprint size={24} className="text-green-600" />
                <h3 className="text-xl font-extrabold leading-tight text-green-600">
                    Basic Information
                </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 space-y-2">
                <div className="flex items-start gap-2 text-bold">
                    <FolderPen className="size-5 min-w-fit" />
                    <div>
                        <p className="text-sm font-semibold">
                            Medicine Name
                        </p>
                        <p className="text-base text-text-strong">
                            {medicineData.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-bold">
                    <IndianRupee className="size-5 min-w-fit" />
                    <div>
                        <p className="text-sm font-semibold">
                            Cost
                        </p>
                        <p className="text-base text-text-strong">
                            {medicineData.cost}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-bold">
                    <Percent className="size-5 min-w-fit" />
                    <div>
                        <p className="text-sm font-semibold">
                            Gst
                        </p>
                        <p className="text-base text-text-strong">
                            {medicineData.gst}%
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-bold">
                    <BadgePercent className="size-5 min-w-fit" />
                    <div>
                        <p className="text-sm font-semibold">
                            Discount
                        </p>
                        <p className="text-base text-text-strong">
                            {medicineData.discount}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-bold">
                    <Hourglass className="size-5 min-w-fit" />
                    <div>
                        <p className="text-sm font-semibold">
                            Expiry
                        </p>
                        <p className="text-base text-text-strong">
                            {format(medicineData.expiry, "dd-MM-yyyy")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-2 text-bold mt-2">
                <Notebook className="size-5 min-w-fit" />
                <div>
                    <p className="text-sm font-semibold">
                        Description
                    </p>
                    <p className="text-base text-text-strong">
                        {medicineData.description}
                    </p>
                </div>
            </div>
        </section>
    )
}