import { api } from '../../app/api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (response) => response.data,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useSendOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation
} = authApi;
