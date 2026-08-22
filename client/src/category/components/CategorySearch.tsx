import { Search } from "lucide-react"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { useNavigate } from "react-router-dom"
import type { ICategory } from "../../types/category"
import { useLazyGetCategorySuggestionsQuery } from "../api/categoryApi"

const CategorySearch = ({ setOpenSearchModal }:
    { setOpenSearchModal: Dispatch<SetStateAction<boolean>> }) => {
    const [query, setQuery] = useState("")
    const [trigger, { data, isFetching, isLoading }] = useLazyGetCategorySuggestionsQuery()
    const navigate = useNavigate()

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim()) {
                trigger(query)
            }
        }, 400)
        return () => clearTimeout(delay)
    }, [query, trigger])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl space-y-2 shadow-2xl overflow-hidden p-2 sm:p-4">
                <div className="flex items-center gap-3 border-b border-gray-300">
                    <Search size={18} className="text-green-600" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Categories..."
                        className="outline-none w-full font-medium text-gray-500"
                    />
                    <div>
                        <button
                            onClick={() => setOpenSearchModal(false)}
                            className="p-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                {query && (
                    <div>
                        {(isLoading || isFetching) && (
                            <p className="text-sm text-gray-500">Loading...</p>
                        )}
                        {data?.data?.length === 0 && (
                            <p className="text-center text-sm text-gray-500">
                                No results found
                            </p>
                        )}
                    </div>
                )}
                {data?.data.length > 0 && (
                    <ul className="hover:bg-green-100 rounded-lg p-2 text-sm text-gray-500">
                        {data.data.map((category: ICategory) => (
                            <li
                                key={category._id}
                                className="text-sm text-gray-500 cursor-pointer"
                                onClick={() => navigate(`/categories/${category._id}`)}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div >
    )
}

export default CategorySearch
