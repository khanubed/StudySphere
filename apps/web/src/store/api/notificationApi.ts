import { baseApi } from './baseApi';
import {
  AppNotification,
  ApiResponse,
  PaginatedResponse,
} from '@studysphere/shared-types';
import {
  setUnreadCount,
  decrementUnreadCount,
  incrementUnreadCount,
} from '../slices/notificationSlice';
import { io, Socket } from 'socket.io-client';

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  academicAlerts: boolean;
  careerAlerts: boolean;
  mentorshipAlerts: boolean;
  discussionReplies: boolean;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      ApiResponse<PaginatedResponse<AppNotification>>,
      { page?: number; category?: string; unreadOnly?: boolean } | void
    >({
      query: (params) => ({
        url: '/notifications',
        params: params || {},
      }),
      providesTags: [{ type: 'Notification', id: 'LIST' }],
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        let socket: Socket | null = null;
        try {
          await cacheDataLoaded;
          const token =
            typeof localStorage !== 'undefined'
              ? localStorage.getItem('token')
              : null;
          if (!token) return;

          const socketUrl =
            import.meta.env.VITE_WS_URL ||
            window.location.origin.replace(/^http/, 'ws');
          socket = io(`${socketUrl}/notifications`, {
            auth: { token },
            transports: ['websocket'],
          });

          socket.on('notification_received', (notification: AppNotification) => {
            dispatch(incrementUnreadCount());
            updateCachedData((draft) => {
              if (draft.data?.items) {
                draft.data.items.unshift(notification);
                draft.data.total += 1;
              }
            });
          });
        } catch {
          // Socket failed or closed
        }
        await cacheEntryRemoved;
        if (socket) {
          socket.disconnect();
        }
      },
    }),
    getUnreadNotificationCount: builder.query<
      ApiResponse<{ count: number }>,
      void
    >({
      query: () => '/notifications/unread-count',
      providesTags: [{ type: 'Notification', id: 'UNREAD_COUNT' }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setUnreadCount(data.data.count));
          }
        } catch {
          // Ignore
        }
      },
    }),
    markNotificationAsRead: builder.mutation<ApiResponse<null>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD_COUNT' },
      ],
      async onQueryStarted(_arg, { dispatch }) {
        dispatch(decrementUnreadCount());
      },
    }),
    markAllNotificationsAsRead: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD_COUNT' },
      ],
      async onQueryStarted(_arg, { dispatch }) {
        dispatch(setUnreadCount(0));
      },
    }),
    updateNotificationPreferences: builder.mutation<
      ApiResponse<NotificationPreferences>,
      Partial<NotificationPreferences>
    >({
      query: (body) => ({
        url: '/notifications/preferences',
        method: 'PATCH',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useUpdateNotificationPreferencesMutation,
} = notificationApi;
