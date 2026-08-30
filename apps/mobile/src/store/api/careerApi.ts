import { baseApi } from './baseApi';
import {
  JobPosting,
  JobApplication,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  JobCategory,
} from '@studysphere/shared-types';

export interface JobFilterParams extends PaginationParams {
  category?: JobCategory;
  isInternship?: boolean;
  isRemote?: boolean;
  search?: string;
}

export interface ApplyJobRequest {
  jobId: string;
  resumeUrl: string;
  coverLetter?: string;
}

export const careerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<
      ApiResponse<PaginatedResponse<JobPosting>>,
      JobFilterParams | void
    >({
      query: (params) => ({
        url: '/jobs',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: 'Career' as const,
                id,
              })),
              { type: 'Career', id: 'JOB_LIST' },
            ]
          : [{ type: 'Career', id: 'JOB_LIST' }],
    }),
    getJobById: builder.query<ApiResponse<JobPosting>, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Career', id }],
    }),
    applyForJob: builder.mutation<ApiResponse<JobApplication>, ApplyJobRequest>({
      query: (body) => ({
        url: `/jobs/${body.jobId}/apply`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Career', id: 'MY_APPLICATIONS' },
        'Dashboard',
      ],
    }),
    getMyJobApplications: builder.query<
      ApiResponse<JobApplication[]>,
      void
    >({
      query: () => '/career/applications/my',
      providesTags: [{ type: 'Career', id: 'MY_APPLICATIONS' }],
    }),
    createAdminJob: builder.mutation<ApiResponse<JobPosting>, Partial<JobPosting>>({
      query: (body) => ({
        url: '/admin/jobs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Career', id: 'JOB_LIST' }],
    }),
    updateAdminJob: builder.mutation<
      ApiResponse<JobPosting>,
      { id: string; changes: Partial<JobPosting> }
    >({
      query: ({ id, changes }) => ({
        url: `/admin/jobs/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Career', id },
        { type: 'Career', id: 'JOB_LIST' },
      ],
    }),
    deleteAdminJob: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/admin/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Career', id: 'JOB_LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useApplyForJobMutation,
  useGetMyJobApplicationsQuery,
  useCreateAdminJobMutation,
  useUpdateAdminJobMutation,
  useDeleteAdminJobMutation,
} = careerApi;
