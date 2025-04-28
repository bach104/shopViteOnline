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
    createOrder: builder.mutation({
      query: ({ cartIds, paymentMethod }) => ({
        url: '/api/orders',
        method: 'POST',
        body: { cartIds, paymentMethod }
      }),
      invalidatesTags: ['Order']
    }),

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
    cancelOrder: builder.mutation({
      query: ({ orderId, reason, status }) => ({
        url: '/api/orders/cancel',
        method: 'PUT',
        body: { 
          orderId, 
          ...(status !== 'hết hàng' && { reason }) 
        }
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId }
      ]
    }),
    getAllOrders: builder.query({
      query: (params = {}) => {
        const { 
          page = 1, 
          status, 
          username, 
          paymentMethod,
          startDate,
          endDate,
          minAmount,
          maxAmount
        } = params;
        const searchParams = new URLSearchParams();
        searchParams.append('page', page);
        if (status) searchParams.append('status', status);
        if (username) searchParams.append('username', username);
        if (paymentMethod) searchParams.append('paymentMethod', paymentMethod);
        if (startDate) searchParams.append('startDate', startDate);
        if (endDate) searchParams.append('endDate', endDate);
        if (minAmount) searchParams.append('minAmount', minAmount);
        if (maxAmount) searchParams.append('maxAmount', maxAmount);
        return `/api/orders/admin?${searchParams.toString()}`;
      },
      transformResponse: (response) => ({
        orders: response.orders,
        pagination: {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalOrders: response.totalOrders,
          ordersPerPage: response.ordersPerPage,
          pageOrdersCount: response.pageOrdersCount
        },
        filters: response.filters || {
          status: 'all',
          username: '',
          paymentMethod: 'all',
          dateRange: { startDate: null, endDate: null },
          amountRange: { minAmount: null, maxAmount: null }
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({ type: 'Order', id: _id })),
              { type: 'Order', id: 'ADMIN_LIST' }
            ]
          : [{ type: 'Order', id: 'ADMIN_LIST' }]
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, cancelledReason }) => ({
        url: '/api/orders/admin/status',
        method: 'PUT',
        body: { 
          orderId, 
          status,
          ...(status === 'hết hàng' && { cancelledReason }) 
        }
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'ADMIN_LIST' }
      ]
    }),

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