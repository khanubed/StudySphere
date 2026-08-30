import { baseApi } from './baseApi';
import {
  AlumniProfile,
  MentorshipRequest,
  ApiResponse,
  PaginatedResponse,
} from '@studysphere/shared-types';

export interface AlumniListItem {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  currentCompany?: string;
  designation?: string;
  skills: string[];
  isVerified: boolean;
}

export const alumniApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlumniList: builder.query<
      ApiResponse<PaginatedResponse<AlumniListItem>>,
      { company?: string; skills?: string[]; graduationYear?: number; page?: number } | void
    >({
      query: (params) => ({
        url: '/alumni',
        params: params || {},
      }),
      providesTags: [{ type: 'Alumni', id: 'LIST' }],
    }),
    getAlumniById: builder.query<ApiResponse<AlumniProfile>, string>({
      query: (id) => `/alumni/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Alumni', id }],
    }),
    requestMentorship: builder.mutation<
      ApiResponse<MentorshipRequest>,
      { alumniId: string; message: string; topic: string }
    >({
      query: ({ alumniId, ...body }) => ({
        url: `/alumni/${alumniId}/mentorship-request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Alumni', id: 'MENTORSHIP_REQUESTS' }],
    }),
    sendConnectionRequest: builder.mutation<
      ApiResponse<{ connectionId: string }>,
      { alumniId: string; note?: string }
    >({
      query: ({ alumniId, ...body }) => ({
        url: `/alumni/${alumniId}/connect`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Alumni', id: 'CONNECTIONS' }],
    }),
    updateConnectionStatus: builder.mutation<
      ApiResponse<null>,
      { connectionId: string; status: 'accepted' | 'declined' }
    >({
      query: ({ connectionId, status }) => ({
        url: `/connections/${connectionId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'Alumni', id: 'CONNECTIONS' }],
    }),
    updateMentorshipStatus: builder.mutation<
      ApiResponse<null>,
      { requestId: string; status: 'accepted' | 'declined'; meetingLink?: string }
    >({
      query: ({ requestId, ...body }) => ({
        url: `/mentorship-requests/${requestId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Alumni', id: 'MENTORSHIP_REQUESTS' }],
    }),
    getMyMentorshipRequests: builder.query<
      ApiResponse<MentorshipRequest[]>,
      void
    >({
      query: () => '/alumni/mentorship/my',
      providesTags: [{ type: 'Alumni', id: 'MENTORSHIP_REQUESTS' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAlumniListQuery,
  useGetAlumniByIdQuery,
  useRequestMentorshipMutation,
  useSendConnectionRequestMutation,
  useUpdateConnectionStatusMutation,
  useUpdateMentorshipStatusMutation,
  useGetMyMentorshipRequestsQuery,
} = alumniApi;
