import { apiSlice } from '../../apiSlice';
import type { ISale } from '../../types/sale';

export const saleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllSales: builder.query<{
            data: ISale[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        }, { page?: number; limit?: number } | void>({
            query: (params) => ({
                url: '/sales',
                params: params ? { page: params.page, limit: params.limit } : undefined,
            }),
            providesTags: ['Sale'],
        }),
        getSalesByMedicine: builder.query<{
            data: ISale[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        }, { medicineId: string; page?: number; limit?: number }>({
            query: ({ medicineId, page, limit }) => ({
                url: `/sales/medicine/${medicineId}`,
                params: { page, limit },
            }),
            providesTags: ['Sale'],
        }),
        getSaleById: builder.query<{ data: ISale }, string>({
            query: (id) => `/sales/${id}`,
            providesTags: ['Sale'],
        }),
        createSale: builder.mutation<{ data: ISale; message: string; success: boolean }, Partial<ISale>>({
            query: (sale) => ({
                url: '/sales/create',
                method: 'POST',
                body: sale,
            }),
            invalidatesTags: ['Sale', 'Medicine'],
        }),
        updateSale: builder.mutation<{ data: ISale }, { id: string; sale: Partial<ISale> }>({
            query: ({ id, sale }) => ({
                url: `/sales/${id}/update`,
                method: 'PATCH',
                body: sale,
            }),
            invalidatesTags: ['Sale', 'Medicine'],
        }),
        deleteSale: builder.mutation<{ data: ISale }, string>({
            query: (id) => ({
                url: `/sales/${id}/delete`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Sale', 'Medicine'],
        }),
        restoreSale: builder.mutation<{ data: ISale }, string>({
            query: (id) => ({
                url: `/sales/${id}/restore`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Sale', 'Medicine'],
        }),
        deleteSalePermanently: builder.mutation<{ data: ISale }, string>({
            query: (id) => ({
                url: `/sales/${id}/permanently`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Sale'],
        }),
    }),
});

export const {
    useGetAllSalesQuery,
    useGetSalesByMedicineQuery,
    useGetSaleByIdQuery,
    useCreateSaleMutation,
    useUpdateSaleMutation,
    useDeleteSaleMutation,
    useRestoreSaleMutation,
    useDeleteSalePermanentlyMutation,
} = saleApi;
