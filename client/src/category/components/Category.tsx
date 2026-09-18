import { format } from "date-fns";
import { BookOpen, CheckSquare, ClockPlus, Fingerprint, FolderPen } from "lucide-react";
import { useParams } from "react-router-dom";
import type { ICategory } from "../../types/category";
import { useGetCategoryByIdQuery } from "../api/categoryApi";
import CategoryActionButtons from "./CategoryActionButtons";

const Category = () => {
    const { id: categoryId } = useParams();
    const { data: category, isLoading, isError } = useGetCategoryByIdQuery(categoryId as string);

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-spinner text-primary">Loading category details...</span>
            </div>
        );
    }

    if (isError || !category) {
        return <div className="p-10 text-red-500 font-semibold">Category not found!</div>;
    }

    return (
        <div className="p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
            <BasicInformation categoryData={category.data} />
            <AdditionalInformation categoryData={category.data} />
            <CategoryActionButtons categoryData={category.data} />
        </div>
    );
};

export default Category;

interface CategoryDataProps {
    categoryData: ICategory;
}

const AdditionalInformation = ({ categoryData }: CategoryDataProps) => {
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
                            {categoryData.createdAt ? format(new Date(categoryData.createdAt), "dd-MM-yyyy") : "N/A"}
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
                            {categoryData.updatedAt ? format(new Date(categoryData.updatedAt), "dd-MM-yyyy") : "N/A"}
                        </p>
                    </div>
                </div>

                {categoryData.deletedAt && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-rose-950/50 text-red-500 dark:text-rose-400 mt-0.5">
                            <ClockPlus className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Deleted At</p>
                            <p className="text-sm font-bold text-red-700 dark:text-rose-300 mt-0.5">
                                {format(new Date(categoryData.deletedAt), "dd-MM-yyyy")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const BasicInformation = ({ categoryData }: CategoryDataProps) => {
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <FolderPen className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Name</p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {categoryData.name}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                        <CheckSquare className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Is Active</p>
                        <div className="mt-1">
                            {categoryData.isActive ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-xs font-bold border border-green-200 dark:border-green-800">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Yes
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                                    No
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                    <FolderPen className="size-5" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {categoryData.description || "No description provided."}
                    </p>
                </div>
            </div>
        </section>
    );
};