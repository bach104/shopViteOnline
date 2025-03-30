import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

export const bankApi = createApi({
  reducerPath: 'bankApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    createVnpayPayment: builder.mutation({
      query: ({ amount, bankCode, orderInfo = 'Thanh toan dich vu' }) => ({
        url: '/api/banks/create-payment',
        method: 'POST',
        body: { 
          amount: Number(amount),
          bankCode: bankCode || '',
          orderInfo 
        },
      }),
      invalidatesTags: ['Transaction'],
    }),

    // Truy vấn trạng thái thanh toán
    getPaymentStatus: builder.query({
      query: ({ orderId, transactionId }) => ({
        url: '/api/banks/query-payment',
        params: { 
          orderId,
          transactionId 
        },
      }),
      providesTags: (result, error, arg) => 
        result ? [{ type: 'Transaction', id: arg.orderId || arg.transactionId }] : [],
    }),

    // Kiểm tra giao dịch định kỳ (polling)
    pollPaymentStatus: builder.query({
      query: ({ orderId, transactionId }) => ({
        url: '/api/banks/query-payment',
        params: { 
          orderId,
          transactionId 
        },
      }),
      providesTags: (result, error, arg) => 
        result ? [{ type: 'Transaction', id: arg.orderId || arg.transactionId }] : [],
    }),
  }),
});

export const { 
  useCreateVnpayPaymentMutation,
  useGetPaymentStatusQuery,
  useLazyGetPaymentStatusQuery,
  usePollPaymentStatusQuery,
} = bankApi;