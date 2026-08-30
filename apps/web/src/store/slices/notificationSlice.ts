import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
  unreadCount: number;
  filter: 'all' | 'unread' | 'academic' | 'career' | 'social' | 'system';
}

const initialState: NotificationState = {
  unreadCount: 0,
  filter: 'all',
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    setNotificationFilter: (
      state,
      action: PayloadAction<
        'all' | 'unread' | 'academic' | 'career' | 'social' | 'system'
      >
    ) => {
      state.filter = action.payload;
    },
  },
});

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  setNotificationFilter,
} = notificationSlice.actions;

export default notificationSlice.reducer;
