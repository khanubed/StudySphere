import { baseApi } from './baseApi';
import { ApiResponse } from '@studysphere/shared-types';
import {
  mockStudentDashboard,
  mockFacultyDashboard,
  mockAdminDashboard,
  DashboardTask,
  DashboardDeadline,
  DashboardAiActivity,
  DashboardTimelineItem,
  DashboardLeaderboardEntry,
} from '@studysphere/shared-data';

export interface StudentDashboardData {
  stats: {
    cgpa: number;
    cgpaScale: number;
    cgpaDelta: string;
    attendancePercentage: number;
    attendanceDelta: string;
    attendanceThreshold: number;
    quizAverage: number;
    quizDelta: string;
    completedQuizzes: number;
    upcomingAssignments: number;
    completedAssignments: number;
    totalAssignments: number;
    studyStreakDays: number;
    studyHoursThisWeek: number;
    aiTokensRemaining: number;
    aiTokensUsed: number;
    aiTokensLimit: number;
    semester: string;
    cohort: string;
    academicYear: string;
  };
  tasks: DashboardTask[];
  deadlines: DashboardDeadline[];
  weeklyAnalytics: Array<{
    name: string;
    hours: number;
    aiQueries: number;
    quizScore: number;
    retentionRate: number;
  }>;
  analyticsByRange?: {
    '7d': Array<{ name: string; hours: number; aiQueries: number; quizScore: number; retentionRate: number; codingMinutes: number }>;
    '30d': Array<{ name: string; hours: number; aiQueries: number; quizScore: number; retentionRate: number; codingMinutes: number }>;
    '90d': Array<{ name: string; hours: number; aiQueries: number; quizScore: number; retentionRate: number; codingMinutes: number }>;
    '1y': Array<{ name: string; hours: number; aiQueries: number; quizScore: number; retentionRate: number; codingMinutes: number }>;
  };
  studyDistribution?: Array<{
    category: string;
    hours: number;
    percentage: number;
    color: string;
  }>;
  accuracyTrend?: Array<{
    topic: string;
    actualScore: number;
    targetScore: number;
    cohortAvg: number;
  }>;
  subjectComparison: Array<{
    subject: string;
    score: number;
    target: number;
    attendance: number;
  }>;
  aiActivities: DashboardAiActivity[];
  recentActivities: DashboardTimelineItem[];
  leaderboard: DashboardLeaderboardEntry[];
  upcomingSchedules: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    type: string;
  }>;
  recommendedResources: Array<{
    id: string;
    title: string;
    subject: string;
    type: string;
    likesCount: number;
  }>;
}

export interface FacultyDashboardData {
  stats: {
    activeClasses: number;
    totalStudents: number;
    pendingEvaluations: number;
    resourcesUploaded: number;
  };
  recentSubmissions: Array<{
    id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: string;
  }>;
}

export interface AdminDashboardData {
  stats: {
    totalUsers: number;
    activeUsersToday: number;
    flaggedResources: number;
    totalAiInferences: number;
  };
  systemHealth: {
    redis: boolean;
    worker: boolean;
    db: boolean;
  };
}

export interface DashboardMetricsData {
  academic: {
    attendance: number;
    gpa?: number;
    completedAssignments: number;
    pendingAssignments: number;
  };
  productivity: {
    studyStreakDays: number;
    studyHoursThisWeek: number;
    quizzesTaken: number;
    aiTokensUsed: number;
    aiTokensRemaining: number;
  };
}

export interface DashboardAnalyticsData {
  range: string;
  series: Array<{
    date: string;
    studyMinutes: number;
    quizScoreAvg: number;
    aiInteractions: number;
  }>;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentDashboard: builder.query<ApiResponse<StudentDashboardData>, { semester?: string; timeRange?: string } | void>({
      queryFn: async (_args) => {
        return {
          data: {
            success: true,
            data: mockStudentDashboard as StudentDashboardData,
            message: 'Academic ledger synchronized successfully',
          },
        };
      },
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    getFacultyDashboard: builder.query<ApiResponse<FacultyDashboardData>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: mockFacultyDashboard as FacultyDashboardData,
          },
        };
      },
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    getAdminDashboard: builder.query<ApiResponse<AdminDashboardData>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: mockAdminDashboard as AdminDashboardData,
          },
        };
      },
      providesTags: ['Dashboard', 'Admin'],
      keepUnusedDataFor: 60,
    }),
    getDashboardMetrics: builder.query<ApiResponse<DashboardMetricsData>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            data: {
              academic: {
                attendance: mockStudentDashboard.stats.attendancePercentage,
                gpa: mockStudentDashboard.stats.cgpa,
                completedAssignments: mockStudentDashboard.stats.completedAssignments,
                pendingAssignments: mockStudentDashboard.stats.upcomingAssignments,
              },
              productivity: {
                studyStreakDays: mockStudentDashboard.stats.studyStreakDays,
                studyHoursThisWeek: mockStudentDashboard.stats.studyHoursThisWeek,
                quizzesTaken: mockStudentDashboard.stats.completedQuizzes,
                aiTokensUsed: mockStudentDashboard.stats.aiTokensUsed,
                aiTokensRemaining: mockStudentDashboard.stats.aiTokensRemaining,
              },
            },
          },
        };
      },
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    getDashboardAnalytics: builder.query<
      ApiResponse<DashboardAnalyticsData>,
      { range?: '7d' | '30d' | '90d' | '1y' } | void
    >({
      queryFn: async (params) => {
        const range = params?.range || '7d';
        return {
          data: {
            success: true,
            data: {
              range,
              series: mockStudentDashboard.weeklyAnalytics.map((item) => ({
                date: item.name,
                studyMinutes: Math.round(item.hours * 60),
                quizScoreAvg: item.quizScore,
                aiInteractions: item.aiQueries,
              })),
            },
          },
        };
      },
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    toggleTaskCompletion: builder.mutation<ApiResponse<{ taskId: string; completed: boolean }>, { taskId: string; completed: boolean }>({
      queryFn: async ({ taskId, completed }) => {
        const task = mockStudentDashboard.tasks.find((t) => t.id === taskId);
        if (task) {
          task.completed = completed;
        }
        return {
          data: {
            success: true,
            data: { taskId, completed },
            message: 'Ledger task updated',
          },
        };
      },
      invalidatesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentDashboardQuery,
  useGetFacultyDashboardQuery,
  useGetAdminDashboardQuery,
  useGetDashboardMetricsQuery,
  useGetDashboardAnalyticsQuery,
  useToggleTaskCompletionMutation,
} = dashboardApi;

