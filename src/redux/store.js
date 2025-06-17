import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import { cartApi } from './features/cart/cartApi';
import { authApi } from './features/auth/authApi';
import authReducer, { logout } from './features/auth/authSlice';
import { productApi } from './features/shop/productsApi';
import productsReducer from './features/shop/productsSlice';
import { commentApi } from './features/comment/commentApi';
import commentReducer from './features/comment/commentSlice';
import { bankApi } from './features/bank/bankApi';
import bankReducer from './features/bank/bankSlice';
import { orderApi } from './features/order/orderApi'; 
import orderReducer from './features/order/orderSlice';
import { messengerApi } from './features/messenger/messengerApi';
import messengerReducer from './features/messenger/messengerSlice';

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
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    
    products: productsReducer,
    [productApi.reducerPath]: productApi.reducer,
    
    cart: cartReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    
    comments: commentReducer,
    [commentApi.reducerPath]: commentApi.reducer,
    
    bank: bankReducer,
    [bankApi.reducerPath]: bankApi.reducer,
    
    order: orderReducer,
    [orderApi.reducerPath]: orderApi.reducer,
    
    messenger: messengerReducer,
    [messengerApi.reducerPath]: messengerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        // API middlewares
        cartApi.middleware,
        authApi.middleware,
        productApi.middleware,
        commentApi.middleware,
        bankApi.middleware,
        orderApi.middleware,
        messengerApi.middleware,
        
        // Custom middlewares
        tokenCheckMiddleware
      ),
});