// orderSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { orderApi } from './orderApi';
const initialState = {
  orders: [],
  adminOrders: {
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      ordersPerPage: 20,
      pageOrdersCount: 0
    },
    filters: {
      status: 'all',
      username: '',
      paymentMethod: 'all',
      dateRange: { startDate: null, endDate: null },
      amountRange: { minAmount: null, maxAmount: null }
    }
  },
  currentOrder: null,
  loading: false,
  error: null,
  momoPayUrl: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAdminOrdersPage: (state, action) => {
      state.adminOrders.pagination.currentPage = action.payload;
    },
    setAdminOrdersFilter: (state, action) => {
      state.adminOrders.filters = {
        ...state.adminOrders.filters,
        ...action.payload
      };
    },
    setMomoPayUrl: (state, action) => {
      state.momoPayUrl = action.payload;
    },
    clearMomoPayUrl: (state) => {
      state.momoPayUrl = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        orderApi.endpoints.createOrder.matchFulfilled,
        (state, action) => {
          if (action.payload?.payUrl) {
            state.momoPayUrl = action.payload.payUrl;
          }
        }
      );
  }
});

export const {
  setCurrentOrder,
  clearCurrentOrder,
  setLoading,
  setError,
  setAdminOrdersPage,
  setAdminOrdersFilter,
  setMomoPayUrl,
  clearMomoPayUrl
} = orderSlice.actions;

export default orderSlice.reducer;
