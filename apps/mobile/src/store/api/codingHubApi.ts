import { baseApi } from './baseApi';
import {
  CodingTrack,
  CodingTopic,
  CodingProblem,
  UserCodingProgress,
  ApiResponse,
} from '@studysphere/shared-types';

export const codingHubApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCodingTracks: builder.query<ApiResponse<CodingTrack[]>, void>({
      query: () => '/coding/tracks',
      providesTags: [{ type: 'CodingHub', id: 'TRACKS' }],
    }),
    getTrackTopics: builder.query<ApiResponse<CodingTopic[]>, string>({
      query: (trackId) => `/coding/tracks/${trackId}/topics`,
      providesTags: (_result, _error, trackId) => [
        { type: 'CodingHub', id: `TRACK_${trackId}` },
      ],
    }),
    getCodingProblem: builder.query<ApiResponse<CodingProblem>, string>({
      query: (problemId) => `/coding/problems/${problemId}`,
      providesTags: (_result, _error, problemId) => [
        { type: 'CodingHub', id: `PROBLEM_${problemId}` },
      ],
    }),
    getUserCodingProgress: builder.query<
      ApiResponse<UserCodingProgress[]>,
      void
    >({
      query: () => '/coding/progress',
      providesTags: [{ type: 'CodingHub', id: 'PROGRESS' }],
    }),
    updateProblemStatus: builder.mutation<
      ApiResponse<UserCodingProgress>,
      {
        problemId: string;
        status: 'not_started' | 'attempted' | 'solved';
        language?: string;
        codeSnippet?: string;
      }
    >({
      query: ({ problemId, ...body }) => ({
        url: `/coding/problems/${problemId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'CodingHub', id: 'PROGRESS' },
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCodingTracksQuery,
  useGetTrackTopicsQuery,
  useGetCodingProblemQuery,
  useGetUserCodingProgressQuery,
  useUpdateProblemStatusMutation,
} = codingHubApi;
