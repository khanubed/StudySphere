import { baseApi } from './baseApi';
import {
  Resource,
  ResourceType,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Comment,
  ContributorPoints,
} from '@studysphere/shared-types';

export interface ResourceFilterParams extends PaginationParams {
  subjectId?: string;
  type?: ResourceType;
  branchId?: string;
  semesterId?: string;
  search?: string;
}

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResources: builder.query<
      ApiResponse<PaginatedResponse<Resource>>,
      ResourceFilterParams | void
    >({
      query: (params) => ({
        url: '/resources',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: 'Resource' as const,
                id,
              })),
              { type: 'Resource', id: 'LIST' },
            ]
          : [{ type: 'Resource', id: 'LIST' }],
    }),
    getResourceById: builder.query<ApiResponse<Resource>, string>({
      query: (id) => `/resources/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),
    uploadResource: builder.mutation<ApiResponse<Resource>, FormData | Partial<Resource>>({
      query: (body) => ({
        url: '/resources',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }, 'Dashboard'],
    }),
    toggleLikeResource: builder.mutation<
      ApiResponse<{ isLiked: boolean; likesCount: number }>,
      string
    >({
      query: (id) => ({
        url: `/resources/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),
    toggleBookmarkResource: builder.mutation<
      ApiResponse<{ isBookmarked: boolean }>,
      string
    >({
      query: (id) => ({
        url: `/resources/${id}/bookmark`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),
    getResourceComments: builder.query<ApiResponse<Comment[]>, string>({
      query: (resourceId) => `/resources/${resourceId}/comments`,
      providesTags: (_result, _error, resourceId) => [
        { type: 'Resource', id: `COMMENTS_${resourceId}` },
      ],
    }),
    addResourceComment: builder.mutation<
      ApiResponse<Comment>,
      { resourceId: string; content: string }
    >({
      query: ({ resourceId, content }) => ({
        url: `/resources/${resourceId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { resourceId }) => [
        { type: 'Resource', id: `COMMENTS_${resourceId}` },
        { type: 'Resource', id: resourceId },
      ],
    }),
    getLeaderboard: builder.query<ApiResponse<ContributorPoints[]>, void>({
      query: () => '/resources/leaderboard',
      providesTags: [{ type: 'Resource', id: 'LEADERBOARD' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useUploadResourceMutation,
  useToggleLikeResourceMutation,
  useToggleBookmarkResourceMutation,
  useGetResourceCommentsQuery,
  useAddResourceCommentMutation,
  useGetLeaderboardQuery,
} = resourceApi;
