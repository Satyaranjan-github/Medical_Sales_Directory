import {
    BookOpen,
    ClockPlus,
    Fingerprint,
    Notebook,
    Tag,
    TrendingUp
} from "lucide-react";
import type { IMargin } from "../../types/margin";
import { useGetMarginByIdQuery } from "../api/marginApi";
import MarginActionButton from "./MarginActionButton";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const Margin = () => {
    const { id: marginId } = useParams();
    const { data: marginRes, isLoading, isError } = useGetMarginByIdQuery(marginId as string);

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-spinner text-primary">Loading margin details...</span>
            </div>
        );
    }

    if (isError || !marginRes?.data) {
        return <div className="p-10 text-red-500 font-semibold">Margin not found!</div>;
    }

    const marginData: IMargin = marginRes.data;

    return (
        <div className="p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            <BasicInformation marginData={marginData} />
            <AdditionalInformation marginData={marginData} />
            <MarginActionButton marginData={marginData} />
        </div>
    );
};

export default Margin;

interface MarginDataProps {
    marginData: IMargin;
}

const BasicInformation = ({ marginData }: MarginDataProps) => {
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <Tag className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Margin Title</p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {marginData.title}
                        </p>
                    </div>
                </div>

                {/* Value */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <TrendingUp className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Margin Value</p>
                        <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                            {marginData.value}%
                        </p>
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
                        {marginData.description || "No description provided."}
                    </p>
                </div>
            </div>
        </section>
    );
};

const AdditionalInformation = ({ marginData }: MarginDataProps) => {
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
                            {marginData.createdAt ? format(new Date(marginData.createdAt), "dd-MM-yyyy") : "N/A"}
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
                            {marginData.updatedAt ? format(new Date(marginData.updatedAt), "dd-MM-yyyy") : "N/A"}
                        </p>
                    </div>
                </div>

                {marginData.deletedAt && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-rose-950/50 text-red-500 dark:text-rose-400 mt-0.5">
                            <ClockPlus className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Deleted At</p>
                            <p className="text-sm font-bold text-red-700 dark:text-rose-300 mt-0.5">
                                {format(new Date(marginData.deletedAt), "dd-MM-yyyy")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
