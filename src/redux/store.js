import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import { cartApi } from './features/cart/cartApi';
import  authApi  from './features/auth/authApi';
import authReducer, { logout } from './features/auth/authSlice'; // Thêm import logout action
import { productApi } from './features/shop/productsApi';
import productsReducer from './features/shop/productsSlice';
import { commentApi } from './features/comment/commentApi';
import commentReducer from './features/comment/commentSlice';
import { bankApi } from './features/bank/bankApi';
import bankReducer from './features/bank/bankSlice';
import { orderApi } from './features/order/orderApi'; 
import orderReducer from './features/order/orderSlice';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

const tokenCheckMiddleware = store => next => action => {
  if (action.type === logout.type) {
    return next(action);
  }

  const state = store.getState();
  const token = state.auth.token;
  
  if (token && isTokenExpired(token)) {
    store.dispatch(logout()); 
    window.location.href = '/?sessionExpired=true';
    return; 
  }
  
  return next(action);
};

export default configureStore({
  reducer: {
    cart: cartReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    products: productsReducer,
    [commentApi.reducerPath]: commentApi.reducer,
    comments: commentReducer,
    [bankApi.reducerPath]: bankApi.reducer,
    bank: bankReducer,
    [orderApi.reducerPath]: orderApi.reducer, 
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        cartApi.middleware,
        authApi.middleware,
        productApi.middleware,
        commentApi.middleware,
        bankApi.middleware,
        orderApi.middleware,
        tokenCheckMiddleware
      ),
});