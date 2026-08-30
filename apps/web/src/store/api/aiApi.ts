import { baseApi } from './baseApi';
import {
  ApiResponse,
  AISummaryResult,
  AIResumeAnalysisResult,
  AIAssignmentAnalysisResult,
  AICodeReviewResult,
  TokenUsage,
  AIGenerationStatus,
} from '@studysphere/shared-types';
import { updateTokenUsage } from '../slices/authSlice';

export interface SummarizeNotesRequest {
  content?: string;
  fileUrl?: string;
  format?: 'short' | 'detailed' | 'flashcards' | 'mindmap';
  subject?: string;
}

export interface GenerateQuizAIRequest {
  topic?: string;
  notesContent?: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'mcq' | 'true_false' | 'fill_blank' | 'short_answer';
}

export interface ResumeAnalysisRequest {
  fileUrl?: string;
  rawText?: string;
  targetRole?: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: AIGenerationStatus;
  progress?: number;
  result?: any;
  error?: string;
}

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTokenUsage: builder.query<ApiResponse<TokenUsage>, void>({
      query: () => '/ai/usage',
      providesTags: ['AI', 'Billing'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(
              updateTokenUsage({
                used: data.data.used,
                limit: data.data.limit,
              })
            );
          }
        } catch {
          // Token query failed
        }
      },
    }),
    getJobStatus: builder.query<ApiResponse<JobStatusResponse>, string>({
      query: (jobId) => `/ai/jobs/${jobId}`,
      providesTags: (_result, _error, jobId) => [{ type: 'AI', id: `JOB_${jobId}` }],
    }),
    summarizeNotes: builder.mutation<
      ApiResponse<{ jobId?: string; result?: AISummaryResult }>,
      SummarizeNotesRequest
    >({
      query: (body) => ({
        url: '/ai/summarize',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AI', 'Resource', 'Dashboard'],
    }),
    generateQuizAI: builder.mutation<
      ApiResponse<{ jobId?: string; quizId?: string; result?: any }>,
      GenerateQuizAIRequest
    >({
      query: (body) => ({
        url: '/ai/quiz/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AI', 'Quiz', 'Dashboard'],
    }),
    analyzeResume: builder.mutation<
      ApiResponse<{ jobId?: string; result?: AIResumeAnalysisResult }>,
      ResumeAnalysisRequest
    >({
      query: (body) => ({
        url: '/ai/resume/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AI', 'Career'],
    }),
    analyzeAssignment: builder.mutation<
      ApiResponse<{ jobId?: string; result?: AIAssignmentAnalysisResult }>,
      { text: string; citationStyle?: string }
    >({
      query: (body) => ({
        url: '/ai/assignment/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AI', 'Assignment'],
    }),
    assistAssignment: builder.mutation<
      ApiResponse<{ jobId?: string; result?: AIAssignmentAnalysisResult }>,
      { text: string; citationStyle?: string }
    >({
      query: (body) => ({
        url: '/ai/assignment/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AI', 'Assignment'],
    }),
    generateStudyPlanAI: builder.mutation<
      ApiResponse<{ jobId?: string; plan?: any }>,
      { subjects: string[]; examDate: string; hoursPerDay: number }
    >({
      query: (body) => ({
        url: '/ai/planner/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AI', 'Planner'],
    }),
    reviewCodeAI: builder.mutation<
      ApiResponse<{ jobId?: string; result?: AICodeReviewResult }>,
      { code: string; language: string; problemId?: string }
    >({
      query: (body) => ({
        url: '/ai/code/review',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AI', 'CodingHub'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTokenUsageQuery,
  useGetJobStatusQuery,
  useLazyGetJobStatusQuery,
  useSummarizeNotesMutation,
  useGenerateQuizAIMutation,
  useAnalyzeResumeMutation,
  useAnalyzeAssignmentMutation,
  useAssistAssignmentMutation,
  useGenerateStudyPlanAIMutation,
  useReviewCodeAIMutation,
} = aiApi;
