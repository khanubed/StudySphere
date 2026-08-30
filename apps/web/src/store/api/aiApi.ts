import { baseApi } from './baseApi';
import {
  ApiResponse,
  AISummaryResult,
  AIResumeAnalysisResult,
  AICodeReviewResult,
  TokenUsage,
  AIGenerationStatus,
  AISummarizerSession,
  PreflightEstimateResult,
  SummaryDepth,
  AssignmentAnalysisReport,
  AssignmentAnalyzeRequest,
  CitationItem,
} from '@studysphere/shared-types';
import { mockAISummarizerSessions, mockAssignmentReports, mockGrammarIssues, mockCitations, mockWritingScore, mockStructureOutline } from '@studysphere/shared-data';
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

export interface SynthesizeStudyKitRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
  totalPages: number;
  wordCount: number;
  depth: SummaryDepth;
  customPromptDirective?: string;
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
          // Token query fallback
        }
      },
    }),

    // AI Summarizer Sessions
    getAISummarizerSessions: builder.query<ApiResponse<AISummarizerSession[]>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: mockAISummarizerSessions,
            message: 'AI Summarizer sessions retrieved',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: ['AI'],
    }),

    getAISummarizerSessionById: builder.query<ApiResponse<AISummarizerSession>, string>({
      queryFn: async (sessionId) => {
        const session = mockAISummarizerSessions.find((s) => s.id === sessionId) || mockAISummarizerSessions[0];
        return {
          data: {
            success: true,
            data: session,
            message: 'Session details loaded',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'AI', id }],
    }),

    preflightEstimate: builder.mutation<
      ApiResponse<PreflightEstimateResult>,
      { fileName: string; totalPages: number; wordCount: number; depth: SummaryDepth }
    >({
      queryFn: async ({ fileName, totalPages, wordCount, depth }) => {
        const tokenMultiplier = depth === 'quick' ? 5 : depth === 'standard' ? 12 : 22;
        const estimatedTokens = Math.max(80, Math.round(totalPages * tokenMultiplier + (wordCount / 100) * 2));
        return {
          data: {
            success: true,
            data: {
              fileName,
              totalPages,
              wordCount,
              depth,
              estimatedTokens,
              currentBalance: 880,
              canAfford: 880 >= estimatedTokens,
            },
            message: 'Pre-flight check passed',
            timestamp: new Date().toISOString(),
          },
        };
      },
    }),

    synthesizeStudyKit: builder.mutation<
      ApiResponse<AISummarizerSession>,
      SynthesizeStudyKitRequest
    >({
      queryFn: async (req) => {
        const newSession: AISummarizerSession = {
          id: `sum-ses-${Date.now()}`,
          userId: 'usr-stu-001',
          title: req.fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          fileName: req.fileName,
          fileSize: req.fileSize,
          fileType: req.fileType,
          totalPages: req.totalPages || 12,
          wordCount: req.wordCount || 4500,
          depth: req.depth,
          tokensUsed: req.depth === 'quick' ? 120 : req.depth === 'standard' ? 320 : 540,
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          shortSummary: `Executive summary synthesized for ${req.fileName}. Core theoretical models, key theorems, and revision checkpoints generated.`,
          detailedSummary: `### Synthesis: ${req.fileName}\n\n#### 1. Core Principles\nComprehensive analysis derived from ${req.totalPages} pages of source lecture material. Key definitions, formula sheets, and exam questions are indexed in the right panel.`,
          keyConcepts: mockAISummarizerSessions[0].keyConcepts,
          formulas: mockAISummarizerSessions[0].formulas,
          flashcards: mockAISummarizerSessions[0].flashcards,
          questions: mockAISummarizerSessions[0].questions,
          mindMap: mockAISummarizerSessions[0].mindMap,
        };

        mockAISummarizerSessions.unshift(newSession);

        return {
          data: {
            success: true,
            data: newSession,
            message: 'Study Kit synthesized successfully',
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ['AI', 'Dashboard'],
    }),

    // AI Assignment Helper Endpoints
    analyzeAssignment: builder.mutation<
      ApiResponse<AssignmentAnalysisReport>,
      AssignmentAnalyzeRequest
    >({
      queryFn: async (req) => {
        const words = (req.text || '').trim().split(/\s+/).filter(Boolean).length;
        const newReport: AssignmentAnalysisReport = {
          id: `rep-${Date.now()}`,
          title: req.fileName ? req.fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') : 'Academic Paper Review',
          rawText: req.text || mockAssignmentReports[0].rawText,
          wordCount: words || 286,
          readingTimeMinutes: Math.max(1, Number(((words || 286) / 250).toFixed(1))),
          tokensUsed: 10,
          citationStyle: req.citationStyle || 'IEEE',
          writingScore: mockWritingScore,
          grammarIssues: mockGrammarIssues,
          citations: mockCitations,
          structureOutline: mockStructureOutline,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockAssignmentReports.unshift(newReport);

        return {
          data: {
            success: true,
            data: newReport,
            message: 'Academic writing audit complete',
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ['AI', 'Assignment', 'Dashboard'],
    }),

    getAssignmentReports: builder.query<ApiResponse<AssignmentAnalysisReport[]>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: mockAssignmentReports,
            message: 'Assignment reports retrieved',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: ['AI', 'Assignment'],
    }),

    getAssignmentReportById: builder.query<ApiResponse<AssignmentAnalysisReport>, string>({
      queryFn: async (id) => {
        const report = mockAssignmentReports.find((r) => r.id === id) || mockAssignmentReports[0];
        return {
          data: {
            success: true,
            data: report,
            message: 'Report details loaded',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'AI', id }],
    }),

    formatCitation: builder.mutation<
      ApiResponse<CitationItem>,
      { rawText: string; style: 'APA' | 'MLA' | 'IEEE' }
    >({
      queryFn: async ({ rawText, style }) => {
        return {
          data: {
            success: true,
            data: {
              id: `cit-${Date.now()}`,
              rawText,
              formattedText: `[1] ${rawText.trim()}, Canonical Reference (${style} Style).`,
              style,
              isValid: true,
            },
            message: 'Citation formatted',
            timestamp: new Date().toISOString(),
          },
        };
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
  useGetAISummarizerSessionsQuery,
  useGetAISummarizerSessionByIdQuery,
  usePreflightEstimateMutation,
  useSynthesizeStudyKitMutation,
  useAnalyzeAssignmentMutation,
  useGetAssignmentReportsQuery,
  useGetAssignmentReportByIdQuery,
  useFormatCitationMutation,
  useGetJobStatusQuery,
  useLazyGetJobStatusQuery,
  useSummarizeNotesMutation,
  useGenerateQuizAIMutation,
  useAnalyzeResumeMutation,
  useGenerateStudyPlanAIMutation,
  useReviewCodeAIMutation,
} = aiApi;
