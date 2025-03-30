import { createSlice } from '@reduxjs/toolkit';
import { productApi } from './productsApi';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    topProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(productApi.endpoints.getProducts.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(productApi.endpoints.getProducts.matchFulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addMatcher(productApi.endpoints.getProducts.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Lỗi không xác định';
      })
      .addMatcher(productApi.endpoints.getTopFeaturedProducts.matchFulfilled, (state, action) => {
        state.topProducts = action.payload.products;
      })
      .addMatcher(productApi.endpoints.addProduct.matchFulfilled, (state, action) => {
        state.products.push(action.payload.product);
      })
      .addMatcher(productApi.endpoints.updateProduct.matchFulfilled, (state, action) => {
        const updatedProduct = action.payload.product;
        const index = state.products.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct; 
        }
      })
      .addMatcher(productApi.endpoints.deleteProduct.matchFulfilled, (state, action) => {
        const { productId, productIds } = action.meta.arg.originalArgs;
        
        if (productId) {
          state.products = state.products.filter(product => product._id !== productId);
        } else if (productIds && Array.isArray(productIds)) {
          state.products = state.products.filter(product => !productIds.includes(product._id));
        }
      });
  },
});

export default productsSlice.reducer;