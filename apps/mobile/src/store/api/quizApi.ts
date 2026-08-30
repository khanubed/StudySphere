import { baseApi } from './baseApi';
import {
  Quiz,
  QuizAttempt,
  QuizResult,
  ApiResponse,
  PaginatedResponse,
  QuizGenerationRequest,
} from '@studysphere/shared-types';
import {
  mockQuizzes,
  mockQuizAttempts,
  mockQuizResults,
} from '@studysphere/shared-data';

export interface SubmitQuizRequest {
  quizId: string;
  answers: Record<string, string | number | boolean | string[]>;
  timeSpentSeconds?: number;
}

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<
      ApiResponse<PaginatedResponse<Quiz>>,
      { subjectId?: string; page?: number; pageSize?: number } | void
    >({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: {
              items: mockQuizzes,
              total: mockQuizzes.length,
              page: 1,
              pageSize: 20,
              totalPages: 1,
              hasMore: false,
            },
            message: 'Quizzes retrieved',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: ['Quiz'],
    }),

    getQuizById: builder.query<ApiResponse<Quiz>, string>({
      queryFn: async (id) => {
        const quiz = mockQuizzes.find((q) => q.id === id) || mockQuizzes[0];
        return {
          data: {
            success: true,
            data: quiz,
            message: 'Quiz details loaded',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Quiz', id }],
    }),

    generateAIQuiz: builder.mutation<
      ApiResponse<Quiz>,
      QuizGenerationRequest
    >({
      queryFn: async (req) => {
        const newQuiz: Quiz = {
          id: `quiz-${Date.now()}`,
          subjectId: 'sub-ai-gen',
          createdBy: 'usr-stu-001',
          title: req.source === 'topic_text' ? req.sourceRef : req.fileName || 'Synthesized Academic Assessment',
          source: 'ai',
          questionCount: req.questionCount || 10,
          difficulty: req.difficulty,
          timeLimitMinutes: req.timeLimitMinutes || Math.round((req.questionCount || 10) * 1.5),
          tokensUsed: (req.questionCount || 10) * 14,
          topicsCovered: ['Core Definitions', 'Theorems & Proofs', 'Applied Problems'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          questions: mockQuizzes[0].questions?.slice(0, req.questionCount || 5),
        };

        mockQuizzes.unshift(newQuiz);

        return {
          data: {
            success: true,
            data: newQuiz,
            message: 'AI Assessment generated successfully',
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ['Quiz', 'Dashboard'],
    }),

    startQuizAttempt: builder.mutation<
      ApiResponse<{ attemptId: string; startedAt: string; quiz: Quiz }>,
      string
    >({
      queryFn: async (quizId) => {
        const quiz = mockQuizzes.find((q) => q.id === quizId) || mockQuizzes[0];
        const attemptId = `attempt-${Date.now()}`;
        return {
          data: {
            success: true,
            data: {
              attemptId,
              startedAt: new Date().toISOString(),
              quiz,
            },
            message: 'Assessment attempt started',
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ['Quiz', 'Dashboard'],
    }),

    submitQuizAttempt: builder.mutation<
      ApiResponse<QuizResult>,
      SubmitQuizRequest
    >({
      queryFn: async (_body) => {
        const result = mockQuizResults['attempt-001'];
        return {
          data: {
            success: true,
            data: result,
            message: 'Assessment graded successfully',
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ['Quiz', 'Dashboard'],
    }),

    getQuizResult: builder.query<ApiResponse<QuizResult>, string>({
      queryFn: async (attemptId) => {
        const result = mockQuizResults[attemptId] || mockQuizResults['attempt-001'];
        return {
          data: {
            success: true,
            data: result,
            message: 'Assessment results retrieved',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Quiz', id }],
    }),

    getQuizHistory: builder.query<ApiResponse<QuizAttempt[]>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: mockQuizAttempts,
            message: 'Quiz history ledger retrieved',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: [{ type: 'Quiz', id: 'HISTORY' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useGenerateAIQuizMutation,
  useStartQuizAttemptMutation,
  useSubmitQuizAttemptMutation,
  useGetQuizResultQuery,
  useGetQuizHistoryQuery,
} = quizApi;
