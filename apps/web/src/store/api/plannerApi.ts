import { baseApi } from './baseApi';
import {
  PlannerTask,
  StudySession,
  ApiResponse,
} from '@studysphere/shared-types';

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
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetStudySessionsQuery,
  useLogStudySessionMutation,
  useUpdateStudySessionMutation,
  useRegeneratePlanMutation,
} = plannerApi;
