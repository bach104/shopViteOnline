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
  error: null
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
      // Reset to first page when filters change
      state.adminOrders.pagination.currentPage = 1;
    },
    resetAdminOrdersFilters: (state) => {
      state.adminOrders.filters = initialState.adminOrders.filters;
      state.adminOrders.pagination.currentPage = 1;
    },
    resetOrderState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      orderApi.endpoints.getUserOrders.matchFulfilled,
      (state, { payload }) => {
        state.orders = payload;
      }
    );
  }
});

// Export actionsa
export const {
  setCurrentOrder,
  clearCurrentOrder,
  setLoading,
  setError,
  setAdminOrdersPage,
  setAdminOrdersFilter,
  resetAdminOrdersFilters,
  resetOrderState
} = orderSlice.actions;

// Export selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectUserOrders = (state) => state.order.orders;
export const selectAdminOrders = (state) => state.order.adminOrders.data;
export const selectAdminOrdersPagination = (state) => state.order.adminOrders.pagination;
export const selectAdminOrdersFilters = (state) => state.order.adminOrders.filters;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;

export default orderSlice.reducer;