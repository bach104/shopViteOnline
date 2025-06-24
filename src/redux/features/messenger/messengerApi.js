import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/messenger`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token || localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
export const messengerApi = createApi({
  reducerPath: 'messengerApi',
  baseQuery,
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        if (data.text) formData.append('text', data.text);
        if (data.image) formData.append('image', data.image);
        if (data.receiverId) formData.append('receiverId', data.receiverId);
        
        return {
          url: '/send',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Messages'],
    }),
    getMessagesWithUser: builder.query({
      query: (userId) => ({
        url: '/messages',
        method: 'GET',
        params: { userId },
      }),
      providesTags: ['Messages'],
    }),
    getConversationList: builder.query({
      query: () => '/conversations',
      providesTags: ['Messages'],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesWithUserQuery,
  useGetConversationListQuery,
} = messengerApi;