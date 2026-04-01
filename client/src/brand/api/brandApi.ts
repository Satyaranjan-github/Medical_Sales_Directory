import { apiSlice } from "../../apiSlice";

export const brandApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBrands: builder.query({
            query: () => '/brands',
            providesTags: ['Brand'],
        }),
        createBrand: builder.mutation({
            query: (brand) => ({
                url: '/brands/create',
                method: 'POST',
                body: brand,
            }),
            invalidatesTags: ['Brand'],
        }),
        getBrandById: builder.query({
            query: (id) => `/brands/${id}`,
            providesTags: ['Brand'],
        }),
        updateBrand: builder.mutation({
            query: (brand) => ({
                url: `/brands/${brand._id}/update`,
                method: 'PATCH',
                body: brand,
            }),
            invalidatesTags: ['Brand'],
        }),
        deleteBrand: builder.mutation({
            query: (id) => ({
                url: `/brands/${id}/delete`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Brand'],
        }),
        restoreBrand: builder.mutation({
            query: (id) => ({
                url: `/brands/${id}/restore`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Brand'],
        }),
        deleteBrandPermanently: builder.mutation({
            query: (id) => ({
                url: `/brands/${id}/permanently`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Brand'],
        }),
        getBrandSuggestions: builder.query({
            query: (query) => ({
                url: '/brands/suggestions',
                params: { query },
            })
        }),
    })
})

export const {
    useCreateBrandMutation,
    useDeleteBrandMutation,
    useGetAllBrandsQuery,
    useGetBrandByIdQuery,
    useRestoreBrandMutation,
    useUpdateBrandMutation,
    useDeleteBrandPermanentlyMutation,
    useLazyGetAllBrandsQuery,
    useLazyGetBrandByIdQuery,
    useLazyGetBrandSuggestionsQuery
} = brandApi