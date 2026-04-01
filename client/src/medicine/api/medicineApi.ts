// RTK Query is used to fetch, cache, and manage server data in Redux apps
// Used for handling loading, success and error states automatically 

import { apiSlice } from '../../apiSlice';

export const medicineApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMedicines: builder.query({
            query: () => '/medicines',
            providesTags: ['Medicine'],
        }),
        createMedicine: builder.mutation({
            query: (medicine) => ({
                url: '/medicines/create',
                method: 'POST',
                body: medicine,
            }),
            invalidatesTags: ['Medicine'],
        }),
        getMedicineById: builder.query({
            query: (id) => `/medicines/${id}`,
            providesTags: ['Medicine'],
        }),
        updateMedicine: builder.mutation({
            query: (medicine) => ({
                url: `/medicines/${medicine._id}/update`,
                method: 'PATCH',
                body: medicine,
            }),
            invalidatesTags: ['Medicine'],
        }),
        deleteMedicine: builder.mutation({
            query: (id) => ({
                url: `/medicines/${id}/delete`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Medicine'],
        }),
        restoreMedicine: builder.mutation({
            query: (id) => ({
                url: `/medicines/${id}/restore`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Medicine'],
        }),
        deleteMedicinePermanently: builder.mutation({
            query: (id) => ({
                url: `/medicines/${id}/permanently`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Medicine'],
        }),
        getMedicineSuggestions: builder.query({
            query: (query) => ({
                url: '/medicines/suggestions',
                params: { query },
            })
        }),
    })
});

export const {
    useCreateMedicineMutation,
    useDeleteMedicineMutation,
    useGetAllMedicinesQuery,
    useGetMedicineByIdQuery,
    useRestoreMedicineMutation,
    useUpdateMedicineMutation,
    useDeleteMedicinePermanentlyMutation,
    useLazyGetAllMedicinesQuery,
    useLazyGetMedicineByIdQuery,
    useLazyGetMedicineSuggestionsQuery
} = medicineApi;