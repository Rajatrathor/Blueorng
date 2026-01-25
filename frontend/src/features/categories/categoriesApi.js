import { api } from '../../app/api';

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => response?.data || [],
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } = categoriesApi;
