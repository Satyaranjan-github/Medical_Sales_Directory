import { apiSlice } from "../../apiSlice"

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (category) => ({
                url: '/categories/create',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),
        getCategoryById: builder.query({
            query: (id) => `/categories/${id}`,
            providesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: (category) => ({
                url: `/categories/${category._id}/update`,
                method: 'PATCH',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}/delete`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Category'],
        }),
        restoreCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}/restore`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategoryPermanently: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}/permanently`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
        getCategorySuggestions: builder.query({
            query: (query) => ({
                url: '/categories/suggestions',
                params: { query },
            })
        }),
    })
})

export const {
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useRestoreCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryPermanentlyMutation,
    useLazyGetAllCategoriesQuery,
    useLazyGetCategoryByIdQuery,
    useLazyGetCategorySuggestionsQuery
} = categoryApi