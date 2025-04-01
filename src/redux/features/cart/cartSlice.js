import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { cartApi } from "./cartApi";
const cartAdapter = createEntityAdapter({
  selectId: (item) => item._id,
});
const initialState = cartAdapter.getInitialState({
  totalQuantity: 0,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      cartAdapter.removeAll(state);
      state.totalQuantity = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalItems = 0;
    },
    updateQuantity: (state, action) => {
      const { cartItemId, newQuantity } = action.payload;
      const item = state.entities[cartItemId];
      if (item && newQuantity > 0) {
        item.quantity = newQuantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(cartApi.endpoints.fetchCart.matchFulfilled, (state, { payload }) => {
      if (!payload?.cartItems) return;
      cartAdapter.setAll(state, payload.cartItems);
      state.totalQuantity = payload.totalQuantity || 0;
      state.currentPage = payload.currentPage || 1;
      state.totalPages = payload.totalPages || 1;
      state.totalItems = payload.totalItems || 0;
    });
  },
});

export const { resetCart, updateQuantity } = cartSlice.actions;
export const { selectAll: selectAllCartItems } = cartAdapter.getSelectors((state) => state.cart);

export default cartSlice.reducer;