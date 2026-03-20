import { format } from "date-fns"
import { BookOpen, CheckSquare, ClockPlus, Fingerprint, FolderPen } from "lucide-react"
import { useParams } from "react-router-dom"
import type { ICategory } from "../../types/category"
import { useGetCategoryByIdQuery } from "../api/categoryApi"
import CategoryActionButtons from "./CategoryActionButtons"

const Category = () => {
    const { id: categoryId } = useParams()
    const { data: category, isLoading, isError } = useGetCategoryByIdQuery(categoryId as string);

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-spinner text-primary">Loading category details...</span>
            </div>
        );
    }

    if (isError || !category) {
        return <div className="p-10 text-red-500">Category not found!</div>;
    }


    return (
        <div className="p-4 sm:p-6 space-y-4">
            <BasicInformation categoryData={category.data} />
            <AdditionalInformation categoryData={category.data} />
            <CategoryActionButtons categoryData={category.data} />
        </div>
    )
}

export default Category


interface CategoryDataProps {
    categoryData: ICategory
}

const AdditionalInformation = ({ categoryData }:
    CategoryDataProps
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
                                {categoryData.createdAt && format(categoryData.createdAt, "dd-MM-yyyy")}
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
                                {categoryData.updatedAt && format(categoryData.updatedAt, "dd-MM-yyyy")}
                            </p>
                        </div>
                    </div>
                    {categoryData.deletedAt && (
                        <div className="flex items-start gap-2">
                            <ClockPlus className="size-5 min-w-fit" />
                            <div>
                                <p className="text-sm font-semibold">
                                    Deleted At
                                </p>
                                <p className="text-base">
                                    {new Date(categoryData.deletedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

const BasicInformation = ({ categoryData }: CategoryDataProps) => {
    return (
        <section className="rounded-lg border p-4 sm:p-6 border-gray-400">
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
                            Category Name
                        </p>
                        <p className="text-base text-text-strong">
                            {categoryData.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-bold">
                    <CheckSquare className="size-5 min-w-fit" />
                    <div>
                        <p className="text-sm font-semibold">
                            Is Active
                        </p>
                        <p className="text-base text-text-strong">
                            {categoryData.isActive ? "Yes" : "No"}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-2 text-bold">
                <FolderPen className="size-5 min-w-fit" />
                <div>
                    <p className="text-sm font-semibold">
                        Description
                    </p>
                    <p className="text-base text-text-strong">
                        {categoryData.description}
                    </p>
                </div>
            </div>
        </section>
    )
}