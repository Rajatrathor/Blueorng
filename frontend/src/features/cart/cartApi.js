import { api } from '../../app/api';

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      transformResponse: (response) => response.data,
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (item) => ({
        url: '/cart',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
