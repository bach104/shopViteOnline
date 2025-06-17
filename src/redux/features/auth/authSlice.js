import { createSlice } from '@reduxjs/toolkit';

const loadUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      error: null,
      usersList: null, 
      pagination: null,
      isAuthenticated: !!token && !isTokenExpired(token),
    };
  } catch (err) {
    console.error('Error loading user from localStorage:', err);
    return { 
      user: null, 
      token: null, 
      error: null,
      usersList: null,
      pagination: null,
      isAuthenticated: false,
    };
  }
};

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

const initialState = loadUserFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.error = null;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.usersList = null;
      state.pagination = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/?sessionExpired=true';
    },
    updateUserInfo: (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      }
      state.error = null;
    },
    checkTokenExpiration: (state) => {
      if (state.token && isTokenExpired(state.token)) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/?sessionExpired=true';
      }
    }
  },
});

export const { 
  setCredentials,
  logout, 
  updateUserInfo,
  checkTokenExpiration
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => {
  if (state.auth.token && isTokenExpired(state.auth.token)) {
    return null;
  }
  return state.auth.user;
};

export const selectCurrentToken = (state) => {
  if (state.auth.token && isTokenExpired(state.auth.token)) {
    return null;
  }
  return state.auth.token;
};

export const selectIsAuthenticated = (state) => {
  if (state.auth.token && isTokenExpired(state.auth.token)) {
    return false;
  }
  return state.auth.isAuthenticated;
};