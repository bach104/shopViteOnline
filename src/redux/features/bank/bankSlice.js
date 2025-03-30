import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paymentInfo: null,
  vnpayReturnParams: null,
  currentTransaction: null,
  status: 'idle', 
  error: null,
  lastChecked: null,
};

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    paymentStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },

    setPaymentInfo: (state, action) => {
      state.paymentInfo = action.payload;
      state.status = 'succeeded';
    },

    setVnpayReturnParams: (state, action) => {
      state.vnpayReturnParams = action.payload;
      state.lastChecked = new Date().toISOString();
    },

    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },

    resetPaymentState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.paymentInfo = null;
    },

    paymentFailed: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { 
  paymentStart,
  setPaymentInfo,
  setVnpayReturnParams,
  setCurrentTransaction,
  resetPaymentState,
  paymentFailed,
} = bankSlice.actions;

export const selectPaymentInfo = (state) => state.bank.paymentInfo;
export const selectVnpayReturnParams = (state) => state.bank.vnpayReturnParams;
export const selectCurrentTransaction = (state) => state.bank.currentTransaction;
export const selectPaymentStatus = (state) => state.bank.status;
export const selectPaymentError = (state) => state.bank.error;
export const selectLastChecked = (state) => state.bank.lastChecked;

export default bankSlice.reducer;