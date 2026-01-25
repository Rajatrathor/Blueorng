import { api } from '../../app/api';

export const contactsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (data) => ({
        url: '/contacts',
        method: 'POST',
        body: data,
      }),
    }),
    getContacts: builder.query({
      query: () => '/contacts',
      transformResponse: (response) => response?.data || [],
      providesTags: ['Contact'],
    }),
  }),
});

export const { useCreateContactMutation, useGetContactsQuery } = contactsApi;
