import { baseApi } from './baseApi';
import {
  FacultyAnalytics,
  Announcement,
  ApiResponse,
  Quiz,
  Resource,
} from '@studysphere/shared-types';

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  institutionId?: string;
  subjectId?: string;
  scheduledFor?: string;
  pinned?: boolean;
}

export const facultyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFacultyAnalytics: builder.query<
      ApiResponse<FacultyAnalytics>,
      void
    >({
      query: () => '/faculty/analytics',
      providesTags: [{ type: 'Faculty', id: 'ANALYTICS' }],
    }),
    getFacultyQuizzes: builder.query<ApiResponse<Quiz[]>, void>({
      query: () => '/faculty/quizzes',
      providesTags: [{ type: 'Faculty', id: 'QUIZZES' }],
    }),
    createFacultyQuiz: builder.mutation<ApiResponse<Quiz>, Partial<Quiz>>({
      query: (body) => ({
        url: '/faculty/quizzes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Faculty', id: 'QUIZZES' }, 'Quiz'],
    }),
    getFacultyResources: builder.query<ApiResponse<Resource[]>, void>({
      query: () => '/faculty/resources',
      providesTags: [{ type: 'Faculty', id: 'RESOURCES' }],
    }),
    getAnnouncements: builder.query<ApiResponse<Announcement[]>, void>({
      query: () => '/faculty/announcements',
      providesTags: [{ type: 'Faculty', id: 'ANNOUNCEMENTS' }],
    }),
    createAnnouncement: builder.mutation<
      ApiResponse<Announcement>,
      CreateAnnouncementRequest
    >({
      query: (body) => ({
        url: '/faculty/announcements',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Faculty', id: 'ANNOUNCEMENTS' }, 'Notification'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFacultyAnalyticsQuery,
  useGetFacultyQuizzesQuery,
  useCreateFacultyQuizMutation,
  useGetFacultyResourcesQuery,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
} = facultyApi;
