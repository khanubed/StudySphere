import { baseApi } from './baseApi';
import {
  Quiz,
  QuizAttempt,
  ApiResponse,
  PaginatedResponse,
} from '@studysphere/shared-types';

export interface SubmitQuizRequest {
  quizId: string;
  answers: Record<string, string | number | boolean | string[]>;
  timeSpentSeconds?: number;
}

export interface QuizAttemptResult {
  attemptId: string;
  quizId: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: Array<{
    questionId: string;
    isCorrect: boolean;
    correctAnswer: any;
    explanation?: string;
  }>;
}

export interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  strongTopics: string[];
  weakTopics: string[];
  history: Array<{
    date: string;
    score: number;
  }>;
}

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<
      ApiResponse<PaginatedResponse<Quiz>>,
      { subjectId?: string; page?: number; pageSize?: number } | void
    >({
      query: (params) => ({
        url: '/quizzes',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
      ? [
              ...result.data.items.map(({ id }) => ({
                type: 'Quiz' as const,
                id,
              })),
              { type: 'Quiz', id: 'LIST' },
            ]
      : [{ type: 'Quiz', id: 'LIST' }],
    }),
    getQuizById: builder.query<ApiResponse<Quiz>, string>({
      query: (id) => `/quizzes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Quiz', id }],
    }),
    startQuizAttempt: builder.mutation<
      ApiResponse<{ attemptId: string; startedAt: string }>,
      string
    >({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/attempts`,
        method: 'POST',
      }),
      invalidatesTags: ['Quiz', 'Dashboard'],
    }),
    submitQuizAnswer: builder.mutation<
      ApiResponse<null>,
      {
        quizId: string;
        attemptId: string;
        questionId: string;
        answer: string | number | boolean | string[];
      }
    >({
      query: ({ quizId, attemptId, ...body }) => ({
        url: `/quizzes/${quizId}/attempts/${attemptId}/answer`,
        method: 'PATCH',
        body,
      }),
    }),
    finalizeQuizAttempt: builder.mutation<
      ApiResponse<QuizAttemptResult>,
      { quizId: string; attemptId: string }
    >({
      query: ({ quizId, attemptId }) => ({
        url: `/quizzes/${quizId}/attempts/${attemptId}/submit`,
        method: 'POST',
      }),
      invalidatesTags: ['Quiz', 'Dashboard'],
    }),
    submitQuizAttempt: builder.mutation<
      ApiResponse<QuizAttemptResult>,
      SubmitQuizRequest
    >({
      query: (body) => ({
        url: `/quizzes/${body.quizId}/attempt`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Quiz', 'Dashboard'],
    }),
    getQuizAttemptResult: builder.query<ApiResponse<QuizAttemptResult>, string>({
      query: (attemptId) => `/quizzes/attempts/${attemptId}`,
      providesTags: (_result, _error, attemptId) => [
        { type: 'Quiz', id: `ATTEMPT_${attemptId}` },
      ],
    }),
    getQuizResult: builder.query<
      ApiResponse<QuizAttemptResult>,
      { quizId: string; attemptId: string }
    >({
      query: ({ quizId, attemptId }) =>
        `/quizzes/${quizId}/attempts/${attemptId}/result`,
      providesTags: (_result, _error, { attemptId }) => [
        { type: 'Quiz', id: `ATTEMPT_${attemptId}` },
      ],
    }),
    getQuizAnalytics: builder.query<ApiResponse<QuizAnalytics>, void>({
      query: () => '/quizzes/analytics',
      providesTags: [{ type: 'Quiz', id: 'ANALYTICS' }],
    }),
    getQuizHistory: builder.query<ApiResponse<QuizAttempt[]>, void>({
      query: () => '/quizzes/history',
      providesTags: [{ type: 'Quiz', id: 'HISTORY' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useStartQuizAttemptMutation,
  useSubmitQuizAnswerMutation,
  useFinalizeQuizAttemptMutation,
  useSubmitQuizAttemptMutation,
  useGetQuizAttemptResultQuery,
  useGetQuizResultQuery,
  useGetQuizAnalyticsQuery,
  useGetQuizHistoryQuery,
} = quizApi;
