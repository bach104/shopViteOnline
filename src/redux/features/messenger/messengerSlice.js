import { createSlice } from '@reduxjs/toolkit';
import { messengerApi } from './messengerApi'; 

const initialState = {
  messages: [],
  conversations: [],
  currentChat: null,
  loading: false,
  error: null,
};

const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetMessages: (state) => {
      state.messages = [];
      state.currentChat = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        messengerApi.endpoints.getMessagesWithUser.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        messengerApi.endpoints.getMessagesWithUser.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.messages = action.payload.data;
        }
      )
      .addMatcher(
        messengerApi.endpoints.getMessagesWithUser.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      )
      .addMatcher(
        messengerApi.endpoints.getConversationList.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        messengerApi.endpoints.getConversationList.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.conversations = action.payload.data;
        }
      )
      .addMatcher(
        messengerApi.endpoints.getConversationList.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const {
  setCurrentChat,
  addMessage,
  resetMessages,
  setLoading,
  setError,
} = messengerSlice.actions;

export default messengerSlice.reducer;
export const selectMessages = (state) => state.messenger.messages;
export const selectConversations = (state) => state.messenger.conversations;
export const selectCurrentChat = (state) => state.messenger.currentChat;
export const selectMessengerLoading = (state) => state.messenger.loading;
export const selectMessengerError = (state) => state.messenger.error;