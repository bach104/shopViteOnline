import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';
import { logout } from './authSlice'; 

const customFetchBaseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api`,
  credentials: 'include',
  prepareHeaders: (headers, { getState, dispatch }) => {
    const token = getState().auth?.token || localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        
        if (Date.now() >= exp) {
          dispatch(logout());
          return headers;
        }
        
        headers.set('Authorization', `Bearer ${token}`);
      } catch (error) {
        console.error('Error processing token:', error);
        dispatch(logout());
      }
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customFetchBaseQuery,
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
      transformErrorResponse: (response) => {
        const errorMessage = response.data?.message || 
                          (response.status === 400 ? 'Thông tin không hợp lệ' : 'Đăng ký thất bại. Vui lòng thử lại!');
        return {
          status: response.status,
          message: errorMessage,
          data: response.data,
        };
      },
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
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
      transformResponse: (response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
        if (response?.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      },
      transformErrorResponse: (response) => {
        const errorMessage = response.data?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại!';
        return {
          status: response.status,
          data: errorMessage,
        };
      },
      invalidatesTags: ['Users'],
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
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        const errorMessage = response.data?.message || 'Lỗi khi tải danh sách người dùng';
        return {
          status: response.status,
          data: errorMessage,
        };
      },
      providesTags: ['Users'],
    }),
    removeUser: builder.mutation({
      query: (userData) => ({
        url: '/auth/remove-users',
        method: 'DELETE',
        body: userData,
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        const errorMessage = response.data?.message || 'Xóa người dùng thất bại. Vui lòng thử lại!';
        return {
          status: response.status,
          data: errorMessage,
        };
      },
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
  useRemoveUserMutation
} = authApi;

export default authApi;