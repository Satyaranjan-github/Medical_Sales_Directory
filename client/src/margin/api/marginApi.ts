import { apiSlice } from '../../apiSlice';

export const marginApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMargins: builder.query({
            query: (params?: { page?: number; limit?: number }) => ({
                url: '/margins',
                params: params ? { page: params.page, limit: params.limit } : undefined,
            }),
            providesTags: ['Margin'],
        }),
        createMargin: builder.mutation({
            query: (margin) => ({
                url: '/margins/create',
                method: 'POST',
                body: margin,
            }),
            invalidatesTags: ['Margin'],
        }),
        getMarginById: builder.query({
            query: (id) => `/margins/${id}`,
            providesTags: ['Margin'],
        }),
        updateMargin: builder.mutation({
            query: (margin) => ({
                url: `/margins/${margin._id}/update`,
                method: 'PATCH',
                body: margin,
            }),
            invalidatesTags: ['Margin'],
        }),
        deleteMargin: builder.mutation({
            query: (id) => ({
                url: `/margins/${id}/delete`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Margin'],
        }),
        restoreMargin: builder.mutation({
            query: (id) => ({
                url: `/margins/${id}/restore`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Margin'],
        }),
        deleteMarginPermanently: builder.mutation({
            query: (id) => ({
                url: `/margins/${id}/permanently`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Margin'],
        }),
        getMarginSuggestions: builder.query({
            query: (query) => ({
                url: '/margins/suggestions',
                params: { query },
            })
        }),
    })
});

export const {
    useCreateMarginMutation,
    useDeleteMarginMutation,
    useGetAllMarginsQuery,
    useGetMarginByIdQuery,
    useRestoreMarginMutation,
    useUpdateMarginMutation,
    useDeleteMarginPermanentlyMutation,
    useLazyGetAllMarginsQuery,
    useLazyGetMarginByIdQuery,
    useLazyGetMarginSuggestionsQuery
} = marginApi;
