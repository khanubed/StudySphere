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
