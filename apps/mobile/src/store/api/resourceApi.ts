import { baseApi } from './baseApi';
import {
  Resource,
  ResourceType,
  ResourceStatus,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Comment,
  LeaderboardEntry,
  LeaderboardScope,
} from '@studysphere/shared-types';
import {
  mockResourcesList,
  mockCommentsList,
  mockLeaderboardEntries,
  mockPopularSubjects,
  mockTrendingTags,
} from '@studysphere/shared-data';

export interface MobileResourceFilterParams extends PaginationParams {
  subjectId?: string;
  type?: ResourceType;
  branchId?: string;
  semesterId?: string;
  semester?: number;
  search?: string;
  status?: ResourceStatus | 'all';
  sortBy?: 'latest' | 'popular' | 'downloads' | 'rating';
}

export interface DriveValidationResult {
  isValid: boolean;
  driveFileId: string;
  fileName: string;
  fileSizeFormatted: string;
  mimeType: string;
  isPublic: boolean;
  ownerName?: string;
  error?: string;
}

export interface SubmitResourcePayload {
  title: string;
  subjectId: string;
  semester: number;
  type: ResourceType;
  driveLink: string;
  tags?: string[];
  description?: string;
}

let mobileDynamicResources: Resource[] = [...mockResourcesList];
let mobileDynamicComments: Comment[] = [...mockCommentsList];

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResources: builder.query<
      ApiResponse<PaginatedResponse<Resource>>,
      MobileResourceFilterParams | void
    >({
      queryFn: async (params) => {
        let items = mobileDynamicResources.filter((r) => r.status === 'published');
        const filter = params || {};

        if (filter.search) {
          const q = filter.search.toLowerCase();
          items = items.filter(
            (r) =>
              r.title.toLowerCase().includes(q) ||
              r.subjectId.toLowerCase().includes(q) ||
              (r.description && r.description.toLowerCase().includes(q))
          );
        }

        if (filter.subjectId && filter.subjectId !== 'All Subjects') {
          items = items.filter((r) =>
            r.subjectId.toLowerCase().includes(filter.subjectId!.toLowerCase())
          );
        }

        if (filter.semester && filter.semester > 0) {
          items = items.filter((r) => r.semester === filter.semester);
        }

        if (filter.type && filter.type !== ('all' as any)) {
          items = items.filter((r) => r.type === filter.type);
        }

        const page = filter.page || 1;
        const pageSize = filter.pageSize || 20;

        return {
          data: {
            success: true,
            data: {
              items,
              total: items.length,
              page,
              pageSize,
              totalPages: Math.ceil(items.length / pageSize) || 1,
              hasMore: page * pageSize < items.length,
            },
            message: 'Academic resources loaded',
          },
        };
      },
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
      queryFn: async (id) => {
        const resource = mobileDynamicResources.find((r) => r.id === id);
        if (!resource) {
          return {
            error: {
              status: 404,
              data: { success: false, message: 'Resource not found' },
            } as any,
          };
        }
        return {
          data: {
            success: true,
            data: resource,
            message: 'Resource retrieved',
          },
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),

    validateDriveUrl: builder.mutation<ApiResponse<DriveValidationResult>, { url: string }>({
      queryFn: async ({ url }) => {
        const driveRegex = /[-\w]{25,}(?!.*[-\w]{25,})/;
        const match = url.match(driveRegex);

        if (!url || !url.includes('drive.google.com') || !match) {
          return {
            data: {
              success: false,
              data: {
                isValid: false,
                driveFileId: '',
                fileName: '',
                fileSizeFormatted: '',
                mimeType: '',
                isPublic: false,
                error: 'Invalid Google Drive link format.',
              },
              message: 'Invalid Google Drive URL',
            },
          };
        }

        const fileId = match[0];
        return {
          data: {
            success: true,
            data: {
              isValid: true,
              driveFileId: fileId,
              fileName: `Academic_Resource_${fileId.slice(0, 8)}.pdf`,
              fileSizeFormatted: '4.8 MB',
              mimeType: 'application/pdf',
              isPublic: true,
              ownerName: 'Campus Contributor',
            },
            message: 'Google Drive file verified successfully',
          },
        };
      },
    }),

    submitResource: builder.mutation<ApiResponse<Resource>, SubmitResourcePayload>({
      queryFn: async (payload) => {
        const newResource: Resource = {
          id: `res-${Date.now()}`,
          title: payload.title,
          description: payload.description || '',
          type: payload.type,
          subjectId: payload.subjectId,
          semester: payload.semester || 5,
          uploadedBy: 'usr-student-01',
          fileUrl: payload.driveLink,
          driveLink: payload.driveLink,
          fileMetadata: {
            driveFileId: 'drive-' + Date.now(),
            fileName: payload.title.replace(/\s+/g, '_') + '.pdf',
            fileSizeFormatted: '4.5 MB',
            mimeType: 'application/pdf',
          },
          tags: payload.tags || ['Curriculum'],
          likesCount: 0,
          bookmarksCount: 0,
          downloadsCount: 0,
          commentsCount: 0,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mobileDynamicResources.unshift(newResource);

        return {
          data: {
            success: true,
            data: newResource,
            message: 'Resource submitted to moderation queue',
          },
        };
      },
      invalidatesTags: [{ type: 'Resource', id: 'LIST' }, 'Dashboard'],
    }),

    toggleLikeResource: builder.mutation<
      ApiResponse<{ isLiked: boolean; likesCount: number }>,
      string
    >({
      queryFn: async (id) => {
        const resource = mobileDynamicResources.find((r) => r.id === id);
        if (resource) {
          resource.likesCount = (resource.likesCount || 0) + 1;
        }
        return {
          data: {
            success: true,
            data: { isLiked: true, likesCount: resource?.likesCount || 1 },
            message: 'Endorsement recorded',
          },
        };
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),

    toggleBookmarkResource: builder.mutation<
      ApiResponse<{ isBookmarked: boolean; bookmarksCount: number }>,
      string
    >({
      queryFn: async (id) => {
        const resource = mobileDynamicResources.find((r) => r.id === id);
        let count = resource?.bookmarksCount || 0;
        if (resource) {
          resource.bookmarksCount = count + 1;
          count = resource.bookmarksCount;
        }
        return {
          data: {
            success: true,
            data: { isBookmarked: true, bookmarksCount: count },
            message: 'Saved to library ledger',
          },
        };
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),

    getResourceComments: builder.query<ApiResponse<Comment[]>, string>({
      queryFn: async (resourceId) => {
        const comments = mobileDynamicComments.filter((c) => c.resourceId === resourceId);
        return {
          data: {
            success: true,
            data: comments,
            message: 'Comments loaded',
          },
        };
      },
      providesTags: (_result, _error, resourceId) => [
        { type: 'Resource', id: `COMMENTS_${resourceId}` },
      ],
    }),

    addResourceComment: builder.mutation<
      ApiResponse<Comment>,
      { resourceId: string; content: string }
    >({
      queryFn: async ({ resourceId, content }) => {
        const newComment: Comment = {
          id: `comm-${Date.now()}`,
          resourceId,
          userId: 'usr-student-01',
          content,
          status: 'visible',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mobileDynamicComments.push(newComment);
        return {
          data: {
            success: true,
            data: newComment,
            message: 'Comment posted',
          },
        };
      },
      invalidatesTags: (_result, _error, { resourceId }) => [
        { type: 'Resource', id: `COMMENTS_${resourceId}` },
        { type: 'Resource', id: resourceId },
      ],
    }),

    getMyResources: builder.query<ApiResponse<Resource[]>, { status?: ResourceStatus | 'all' } | void>({
      queryFn: async (params) => {
        const status = params?.status || 'all';
        let items = mobileDynamicResources.filter((r) => r.uploadedBy === 'usr-student-01');
        if (status !== 'all') {
          items = items.filter((r) => r.status === status);
        }
        return {
          data: {
            success: true,
            data: items,
            message: 'My submissions loaded',
          },
        };
      },
      providesTags: [{ type: 'Resource', id: 'MY_RESOURCES' }],
    }),

    getResourceLeaderboard: builder.query<ApiResponse<LeaderboardEntry[]>, { scope?: LeaderboardScope } | void>({
      queryFn: async (params) => {
        const scope = params?.scope || 'weekly';
        const entries = mockLeaderboardEntries[scope] || mockLeaderboardEntries.weekly;
        return {
          data: {
            success: true,
            data: entries,
            message: 'Leaderboard loaded',
          },
        };
      },
      providesTags: [{ type: 'Resource', id: 'LEADERBOARD' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useValidateDriveUrlMutation,
  useSubmitResourceMutation,
  useToggleLikeResourceMutation,
  useToggleBookmarkResourceMutation,
  useGetResourceCommentsQuery,
  useAddResourceCommentMutation,
  useGetMyResourcesQuery,
  useGetResourceLeaderboardQuery,
} = resourceApi;

