import { baseApi } from './baseApi';
import { ApiResponse } from '@studysphere/shared-types';

export interface StudentDashboardData {
  stats: {
    studyStreakDays: number;
    attendancePercentage: number;
    completedQuizzes: number;
    upcomingAssignments: number;
    aiTokensRemaining: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }>;
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
    getStudentDashboard: builder.query<ApiResponse<StudentDashboardData>, void>({
      query: () => '/dashboard/student',
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    getFacultyDashboard: builder.query<ApiResponse<FacultyDashboardData>, void>({
      query: () => '/dashboard/faculty',
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    getAdminDashboard: builder.query<ApiResponse<AdminDashboardData>, void>({
      query: () => '/dashboard/admin',
      providesTags: ['Dashboard', 'Admin'],
      keepUnusedDataFor: 60,
    }),
    getDashboardMetrics: builder.query<ApiResponse<DashboardMetricsData>, void>({
      query: () => '/dashboard/metrics',
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
    }),
    getDashboardAnalytics: builder.query<
      ApiResponse<DashboardAnalyticsData>,
      { range?: '7d' | '30d' | '90d' | '1y' } | void
    >({
      query: (params) => ({
        url: '/dashboard/analytics',
        params: params || {},
      }),
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 60,
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
} = dashboardApi;
