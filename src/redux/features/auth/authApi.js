import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

// Tạo custom fetchBaseQuery
const customFetchBaseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/auth`,
  credentials: 'include',
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async (args, api, extraOptions) => {
    try {
      const result = await customFetchBaseQuery(args, api, extraOptions);
      return { data: result.data };
    } catch {
      return { data: { success: false, message: 'Lỗi kết nối' } };
    }
  },
  
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/register',
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
        const errorMessage = response.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
        return {
          status: response.status,
          data: errorMessage,
        };
      },
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userData }) => {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
        }
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
          if (userData[key]) {
            formData.append(key, userData[key]);
          }
        });
        return {
          url: '/update-info',
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
        }
        
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (username) params.append('username', username);
        if (email) params.append('email', email);
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        
        return {
          url: '/',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      query: (userData) => {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
        }
        return {
          url: '/remove-users',
          method: 'DELETE',
          body: userData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
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