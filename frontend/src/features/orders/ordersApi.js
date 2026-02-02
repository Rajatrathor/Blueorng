import { api } from '../../app/api';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 COD / normal order
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: '/payment/verify',
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
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),

  }),
});


export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,

} = ordersApi;