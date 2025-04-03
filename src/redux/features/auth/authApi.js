import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';
import { logout } from './authSlice';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api`,
  credentials: 'include',
  prepareHeaders: (headers, { getState, dispatch }) => {
    const token = getState().auth?.token || localStorage.getItem('token');
    
    if (token && isTokenExpired(token)) {
      dispatch(logout());
      window.location.href = '/?sessionExpired=true';
      return headers;
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Thêm interceptor cho response
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result?.error?.status === 401 && !args.url.includes('/auth/login')) {
    api.dispatch(logout());
    window.location.href = '/?sessionExpired=true';
  }
  
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      transformResponse: (response) => {
        if (response?.user && response?.token) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
        }
        return response;
      },
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      transformResponse: (response) => {
        if (response?.user && response?.token) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
        }
        return response;
      },
    }),
    checkSession: builder.query({
      query: () => '/auth/check-session',
    }),
    updateUser: builder.mutation({
      query: ({ userData }) => {
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
          if (userData[key]) {
            formData.append(key, userData[key]);
          }
        });
        return {
          url: '/auth/update-info',
          method: 'PUT',
          body: formData,
        };
      },
    }),
    getUsers: builder.query({
      query: ({ 
        page = 1, 
        limit = 20, 
        username, 
        email, 
        sortBy = 'createdAt', 
        sortOrder = -1 
      }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (username) params.append('username', username);
        if (email) params.append('email', email);
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        
        return {
          url: '/auth/',
          method: 'GET',
          params,
        };
      },
    }),
    removeUser: builder.mutation({
      query: (userData) => ({
        url: '/auth/remove-users',
        method: 'DELETE',
        body: userData,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useCheckSessionQuery,
  useUpdateUserMutation,
  useGetUsersQuery,
  useRemoveUserMutation
} = authApi;
export default authApi;