import { apiSlice } from "../../apiSlice"

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategorys: builder.query({
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
        })
    })
})

export const {
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useGetAllCategorysQuery,
    useGetCategoryByIdQuery,
    useRestoreCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryPermanentlyMutation,
    useLazyGetAllCategorysQuery,
    useLazyGetCategoryByIdQuery
} = categoryApi