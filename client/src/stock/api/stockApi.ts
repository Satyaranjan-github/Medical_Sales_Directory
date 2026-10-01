import { apiSlice } from "../../apiSlice";

export const stockApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllStocks: builder.query({
            query: (params?: { page?: number; limit?: number; status?: string }) => ({
                url: "/stocks",
                params: params
                    ? { page: params.page, limit: params.limit, status: params.status }
                    : undefined
            }),
            providesTags: ["Stock"]
        }),
        createStock: builder.mutation({
            query: (stock) => ({
                url: "/stocks/create",
                method: "POST",
                body: stock
            }),
            invalidatesTags: ["Stock", "Medicine"]
        }),
        getStockById: builder.query({
            query: (id) => `/stocks/${id}`,
            providesTags: ["Stock"]
        }),
        updateStock: builder.mutation({
            query: (stock) => ({
                url: `/stocks/${stock._id}/update`,
                method: "PATCH",
                body: stock
            }),
            invalidatesTags: ["Stock", "Medicine"]
        }),
        deleteStock: builder.mutation({
            query: (id) => ({
                url: `/stocks/${id}/delete`,
                method: "PATCH"
            }),
            invalidatesTags: ["Stock", "Medicine"]
        }),
        restoreStock: builder.mutation({
            query: (id) => ({
                url: `/stocks/${id}/restore`,
                method: "PATCH"
            }),
            invalidatesTags: ["Stock", "Medicine"]
        }),
        deleteStockPermanently: builder.mutation({
            query: (id) => ({
                url: `/stocks/${id}/permanently`,
                method: "DELETE"
            }),
            invalidatesTags: ["Stock", "Medicine"]
        }),
        getStockSuggestions: builder.query({
            query: (query) => ({
                url: "/stocks/suggestions",
                params: { query }
            })
        })
    })
});

export const {
    useCreateStockMutation,
    useDeleteStockMutation,
    useGetAllStocksQuery,
    useGetStockByIdQuery,
    useRestoreStockMutation,
    useUpdateStockMutation,
    useDeleteStockPermanentlyMutation,
    useLazyGetAllStocksQuery,
    useLazyGetStockByIdQuery,
    useLazyGetStockSuggestionsQuery,
    useGetStockSuggestionsQuery
} = stockApi;
