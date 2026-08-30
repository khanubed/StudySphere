import { baseApi } from './baseApi';
import {
  Assignment,
  ApiResponse,
  PaginatedResponse,
} from '@studysphere/shared-types';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl?: string;
  content?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
}

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query<
      ApiResponse<PaginatedResponse<Assignment>>,
      { subjectId?: string; status?: string; page?: number } | void
    >({
      query: (params) => ({
        url: '/assignments',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: 'Assignment' as const,
                id,
              })),
              { type: 'Assignment', id: 'LIST' },
            ]
          : [{ type: 'Assignment', id: 'LIST' }],
    }),
    getAssignmentById: builder.query<ApiResponse<Assignment>, string>({
      query: (id) => `/assignments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Assignment', id }],
    }),
    submitAssignment: builder.mutation<
      ApiResponse<AssignmentSubmission>,
      { assignmentId: string; fileUrl?: string; content?: string }
    >({
      query: ({ assignmentId, ...body }) => ({
        url: `/assignments/${assignmentId}/submit`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { assignmentId }) => [
        { type: 'Assignment', id: assignmentId },
        { type: 'Assignment', id: 'LIST' },
        'Dashboard',
      ],
    }),
    getMySubmissions: builder.query<ApiResponse<AssignmentSubmission[]>, void>({
      query: () => '/assignments/submissions/my',
      providesTags: [{ type: 'Assignment', id: 'MY_SUBMISSIONS' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useSubmitAssignmentMutation,
  useGetMySubmissionsQuery,
} = assignmentApi;
