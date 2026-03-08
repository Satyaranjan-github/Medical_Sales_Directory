// RTK Query is used to fetch, cache, and manage server data in Redux apps
// Used for handling loading, success and error states automatically 

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const medicineApi = createApi({
    reducerPath: 'medicineApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000/api' }),
    tagTypes: ['Medicine'],
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
    useLazyGetMedicineByIdQuery
} = medicineApi;