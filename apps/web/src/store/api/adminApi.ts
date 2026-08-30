import { baseApi } from './baseApi';
import {
  PlatformAnalytics,
  ApiResponse,
  PaginatedResponse,
  UserProfile,
  UserRole,
  Resource,
} from '@studysphere/shared-types';

export interface AdminUserListItem extends UserProfile {
  isVerified: boolean;
  isActive: boolean;
}

export interface ContentModerationItem {
  id: string;
  resource: Resource;
  reason?: string;
  flaggedBy?: string;
  createdAt: string;
}

export interface PlanConfig {
  id: string;
  name: 'free' | 'pro' | 'institution';
  monthlyPrice: number;
  aiTokenLimit: number;
  features: Record<string, boolean>;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<
      ApiResponse<PaginatedResponse<AdminUserListItem>>,
      { role?: UserRole; search?: string; page?: number } | void
    >({
      query: (params) => ({
        url: '/admin/users',
        params: params || {},
      }),
      providesTags: [{ type: 'Admin', id: 'USERS' }],
    }),
    updateUserRole: builder.mutation<
      ApiResponse<null>,
      { userId: string; role: UserRole }
    >({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: [{ type: 'Admin', id: 'USERS' }],
    }),
    getModerationQueue: builder.query<
      ApiResponse<PaginatedResponse<ContentModerationItem>>,
      { status?: 'pending' | 'approved' | 'rejected'; page?: number } | void
    >({
      query: (params) => ({
        url: '/admin/moderation',
        params: params || {},
      }),
      providesTags: [{ type: 'Admin', id: 'MODERATION' }],
    }),
    reviewModerationItem: builder.mutation<
      ApiResponse<null>,
      { itemId: string; action: 'approve' | 'reject'; notes?: string }
    >({
      query: ({ itemId, ...body }) => ({
        url: `/admin/moderation/${itemId}/review`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Admin', id: 'MODERATION' },
        'Resource',
        'Dashboard',
      ],
    }),
    getPlatformAnalytics: builder.query<
      ApiResponse<PlatformAnalytics>,
      { timeRange?: '7d' | '30d' | '90d' | '1y' } | void
    >({
      query: (params) => ({
        url: '/admin/analytics',
        params: params || {},
      }),
      providesTags: [{ type: 'Admin', id: 'ANALYTICS' }],
    }),
    updatePlanConfig: builder.mutation<
      ApiResponse<PlanConfig>,
      { planId: string; config: Partial<PlanConfig> }
    >({
      query: ({ planId, config }) => ({
        url: `/admin/plans/${planId}`,
        method: 'PATCH',
        body: config,
      }),
      invalidatesTags: ['Billing', 'Admin'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useGetModerationQueueQuery,
  useReviewModerationItemMutation,
  useGetPlatformAnalyticsQuery,
  useUpdatePlanConfigMutation,
} = adminApi;
