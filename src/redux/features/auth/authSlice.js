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
    };
  } catch (err) {
    console.error('Error deserializing user from localStorage:', err);
    return { 
      user: null, 
      token: null, 
      error: null,
      usersList: null,
      pagination: null,
    };
  }
};

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
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      }
      state.error = null;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.usersList = null;
      state.pagination = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUserInfo: (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      }
      state.error = null;
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload.users;
      state.pagination = {
        totalPages: action.payload.totalPages,
        totalUsers: action.payload.totalUsers,
        currentPage: action.payload.currentPage,
        usersPerPage: action.payload.usersPerPage,
      };
    },
    removeUsersFromList: (state, action) => {
      if (state.usersList && Array.isArray(action.payload)) {
        state.usersList = state.usersList.filter(
          user => !action.payload.includes(user._id)
        );
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setCredentials,
  setUser, 
  logout, 
  updateUserInfo, 
  setUsersList,
  setError, 
  clearError,
  removeUsersFromList,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;