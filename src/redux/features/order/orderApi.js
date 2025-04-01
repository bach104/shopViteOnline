import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // Tạo đơn hàng mới
    createOrder: builder.mutation({
      query: ({ cartIds, paymentMethod }) => ({
        url: '/api/orders',
        method: 'POST',
        body: { cartIds, paymentMethod }
      }),
      invalidatesTags: ['Order']
    }),

    // Lấy danh sách đơn hàng của người dùng
    getUserOrders: builder.query({
      query: () => '/api/orders/user',
      transformResponse: (response) => response.orders,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Order', id: _id })),
              { type: 'Order', id: 'LIST' }
            ]
          : [{ type: 'Order', id: 'LIST' }]
    }),

    // Huỷ đơn hàng
    cancelOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: '/api/orders/cancel',
        method: 'PUT',
        body: { orderId, reason }
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId }
      ]
    }),

    // Lấy tất cả đơn hàng (admin)
    getAllOrders: builder.query({
      query: () => '/api/orders/admin',
      transformResponse: (response) => response.orders,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Order', id: _id })),
              { type: 'Order', id: 'ADMIN_LIST' }
            ]
          : [{ type: 'Order', id: 'ADMIN_LIST' }]
    }),

    // Cập nhật trạng thái đơn hàng (admin)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: '/api/orders/admin/status',
        method: 'PUT',
        body: { orderId, status }
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'ADMIN_LIST' }
      ]
    }),

    // Lấy chi tiết đơn hàng
    getOrderDetails: builder.query({
      query: (orderId) => `/api/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    })
  })
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderDetailsQuery
} = orderApi;