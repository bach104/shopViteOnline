import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  adminOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
  statusFilter: 'all',
  paymentMethodFilter: 'all'
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Set đơn hàng hiện tại
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },

    // Xoá đơn hàng hiện tại
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    // Set trạng thái loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set lỗi
    setError: (state, action) => {
      state.error = action.payload;
    },

    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },

    setPaymentMethodFilter: (state, action) => {
      state.paymentMethodFilter = action.payload;
    },

    resetOrderState: () => initialState
  },

});

// Export actions
export const {
  setCurrentOrder,
  clearCurrentOrder,
  setLoading,
  setError,
  setStatusFilter,
  setPaymentMethodFilter,
  resetOrderState
} = orderSlice.actions;

// Export selector
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;
export const selectAdminOrders = (state) => state.order.adminOrders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectStatusFilter = (state) => state.order.statusFilter;
export const selectPaymentMethodFilter = (state) => state.order.paymentMethodFilter;

export default orderSlice.reducer;