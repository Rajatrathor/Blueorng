import { api } from '../../app/api';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (response) => response?.data || [],
      providesTags: ['UserList'],
    }),
    updateMe: builder.mutation({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['User'],
    }),
    createAdmin: builder.mutation({
      query: (data) => ({
        url: '/users/admin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserList'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserList'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateAdminMutation,
  useDeleteUserMutation,
  useUpdateMeMutation,
} = usersApi;
