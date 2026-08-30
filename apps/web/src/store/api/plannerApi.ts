import { baseApi } from './baseApi';
import {
  PlannerTask,
  StudySession,
  ApiResponse,
  StudyPlan,
  GenerateStudyPlanRequest,
  StudySessionItem,
  SessionStatusType,
} from '@studysphere/shared-types';
import { mockStudyPlan, mockTodayStudySessions } from '@studysphere/shared-data';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  subjectId?: string;
}

export interface LogStudySessionRequest {
  subjectId?: string;
  topic?: string;
  durationMinutes: number;
  notes?: string;
}

export interface RegeneratePlanRequest {
  targetExamDate?: string;
  dailyHours?: number;
  weakSubjects?: string[];
}

export const plannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Study Plan Queries and Mutations
    getStudyPlan: builder.query<ApiResponse<StudyPlan>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: mockStudyPlan,
            message: 'Active study plan loaded',
            timestamp: new Date().toISOString(),
          },
        };
      },
      providesTags: [{ type: 'Planner', id: 'STUDY_PLAN' }],
    }),

    generateAdaptivePlan: builder.mutation<ApiResponse<StudyPlan>, GenerateStudyPlanRequest>({
      queryFn: async (req) => {
        const updatedPlan: StudyPlan = {
          ...mockStudyPlan,
          id: `plan-${Date.now()}`,
          dailyHours: req.dailyHours || 6.0,
          preferredPattern: req.preferredPattern || 'morning',
          readinessScore: Math.min(100, mockStudyPlan.readinessScore + 4),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          data: {
            success: true,
            data: updatedPlan,
            message: 'Adaptive study plan generated successfully',
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: [{ type: 'Planner', id: 'STUDY_PLAN' }, 'Dashboard'],
    }),

    updateStudySessionStatus: builder.mutation<
      ApiResponse<StudySessionItem>,
      { sessionId: string; status: SessionStatusType }
    >({
      queryFn: async ({ sessionId, status }) => {
        const session = mockTodayStudySessions.find((s) => s.id === sessionId);
        if (session) {
          session.status = status;
          if (status === 'completed') {
            session.completedAt = new Date().toISOString();
          }
        }
        return {
          data: {
            success: true,
            data: session || mockTodayStudySessions[0],
            message: `Session marked as ${status}`,
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: [{ type: 'Planner', id: 'STUDY_PLAN' }, 'Dashboard'],
    }),

    rebalanceWeeklyPlan: builder.mutation<ApiResponse<StudyPlan>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: mockStudyPlan,
            message: 'Weekly schedule rebalanced across remaining study slots',
            timestamp: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: [{ type: 'Planner', id: 'STUDY_PLAN' }, 'Dashboard'],
    }),

    getTasks: builder.query<
      ApiResponse<PlannerTask[]>,
      { date?: string; status?: string } | void
    >({
      query: (params) => ({
        url: '/planner/tasks',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Planner' as const,
                id,
              })),
              { type: 'Planner', id: 'TASK_LIST' },
            ]
          : [{ type: 'Planner', id: 'TASK_LIST' }],
    }),
    createTask: builder.mutation<ApiResponse<PlannerTask>, CreateTaskRequest>({
      query: (body) => ({
        url: '/planner/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Planner', id: 'TASK_LIST' }, 'Dashboard'],
    }),
    updateTask: builder.mutation<
      ApiResponse<PlannerTask>,
      { id: string; changes: Partial<PlannerTask> }
    >({
      query: ({ id, changes }) => ({
        url: `/planner/tasks/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Planner', id },
        { type: 'Planner', id: 'TASK_LIST' },
      ],
    }),
    deleteTask: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/planner/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Planner', id: 'TASK_LIST' }, 'Dashboard'],
    }),
    getStudySessions: builder.query<
      ApiResponse<StudySession[]>,
      { fromDate?: string; toDate?: string } | void
    >({
      query: (params) => ({
        url: '/planner/sessions',
        params: params || {},
      }),
      providesTags: [{ type: 'Planner', id: 'SESSIONS' }],
    }),
    logStudySession: builder.mutation<
      ApiResponse<StudySession>,
      LogStudySessionRequest
    >({
      query: (body) => ({
        url: '/planner/sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Planner', id: 'SESSIONS' },
        'Dashboard',
      ],
    }),
    updateStudySession: builder.mutation<
      ApiResponse<StudySession>,
      { id: string; changes: Partial<StudySession> }
    >({
      query: ({ id, changes }) => ({
        url: `/planner/sessions/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      invalidatesTags: [{ type: 'Planner', id: 'SESSIONS' }],
    }),
    regeneratePlan: builder.mutation<
      ApiResponse<{ planId: string; generatedSchedule: any }>,
      RegeneratePlanRequest
    >({
      query: (body) => ({
        url: '/planner/regenerate',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Planner', id: 'TASK_LIST' },
        { type: 'Planner', id: 'SESSIONS' },
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudyPlanQuery,
  useGenerateAdaptivePlanMutation,
  useUpdateStudySessionStatusMutation,
  useRebalanceWeeklyPlanMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetStudySessionsQuery,
  useLogStudySessionMutation,
  useUpdateStudySessionMutation,
  useRegeneratePlanMutation,
} = plannerApi;
