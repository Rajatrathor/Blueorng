import { api } from '../../app/api';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/myorders',
      transformResponse: (response) => response?.data || [],
      providesTags: ['Order'],
    }),
    getOrders: builder.query({
      query: () => '/orders',
      transformResponse: (response) => response?.data || [],
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
