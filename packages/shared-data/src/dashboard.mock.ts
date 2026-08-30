export interface DashboardTask {
  id: string;
  title: string;
  course: string;
  dueTime: string;
  completed: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'revision' | 'coding' | 'assignment' | 'quiz';
}

export interface DashboardDeadline {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  hoursLeft: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  type: 'assignment' | 'quiz' | 'project' | 'career';
}

export interface DashboardAiActivity {
  id: string;
  title: string;
  type: string;
  action: string;
  tokensUsed: number;
  duration: string;
  status: 'completed' | 'cached' | 'streaming' | 'failed';
  timestamp: string;
}

export interface DashboardTimelineItem {
  id: string;
  type: 'quiz_completed' | 'resource_uploaded' | 'mentorship_accepted' | 'attendance_verified' | 'assignment_submitted';
  title: string;
  course?: string;
  meta: string;
  timestamp: string;
}

export interface DashboardLeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  branch: string;
  semester: string;
  streakDays: number;
  points: number;
  isCurrentUser?: boolean;
  verified: boolean;
}

export const mockStudentDashboard = {
  stats: {
    cgpa: 9.12,
    cgpaScale: 10.0,
    cgpaDelta: '+0.24 vs Sem IV',
    attendancePercentage: 89.5,
    attendanceDelta: '+1.2%',
    attendanceThreshold: 75.0,
    quizAverage: 91.4,
    quizDelta: '+3.1%',
    completedQuizzes: 14,
    upcomingAssignments: 2,
    completedAssignments: 14,
    totalAssignments: 16,
    studyStreakDays: 12,
    studyHoursThisWeek: 34.5,
    aiTokensRemaining: 880,
    aiTokensUsed: 120,
    aiTokensLimit: 1000,
    semester: 'Semester 5',
    cohort: 'CS-B (Batch of 2027)',
    academicYear: '2026–2027',
  },
  tasks: [
    {
      id: 'task-1',
      title: 'DBMS B+ Tree Indexing & Query Optimization Revision',
      course: 'CS-301 Database Systems',
      dueTime: '10:00 AM',
      completed: true,
      priority: 'high' as const,
      category: 'revision' as const,
    },
    {
      id: 'task-2',
      title: 'Dijkstra & Prim Algorithm Problem Set 4',
      course: 'CS-302 Algorithms',
      dueTime: '02:00 PM',
      completed: false,
      priority: 'medium' as const,
      category: 'coding' as const,
    },
    {
      id: 'task-3',
      title: 'OS Semaphore & Mutex Lab Writeup & PDF Upload',
      course: 'CS-303 Operating Systems',
      dueTime: '05:30 PM',
      completed: false,
      priority: 'urgent' as const,
      category: 'assignment' as const,
    },
    {
      id: 'task-4',
      title: 'AI Practice Quiz on Computer Networks Transport Layer',
      course: 'CS-304 Computer Networks',
      dueTime: '08:00 PM',
      completed: false,
      priority: 'low' as const,
      category: 'quiz' as const,
    },
  ],
  deadlines: [
    {
      id: 'dl-1',
      title: 'B-Tree Lab Implementation Submission',
      course: 'CS-301 Database Systems',
      dueDate: 'Today, 11:59 PM',
      hoursLeft: 6,
      priority: 'urgent' as const,
      type: 'assignment' as const,
    },
    {
      id: 'dl-2',
      title: 'Computer Networks Midterm Live Quiz Simulation',
      course: 'CS-304 Computer Networks',
      dueDate: 'Tomorrow, 10:00 AM',
      hoursLeft: 24,
      priority: 'high' as const,
      type: 'quiz' as const,
    },
    {
      id: 'dl-3',
      title: 'Software Engineering Sprint 2 Architecture Review',
      course: 'CS-305 Software Eng.',
      dueDate: 'Sep 02, 2026',
      hoursLeft: 72,
      priority: 'medium' as const,
      type: 'project' as const,
    },
    {
      id: 'dl-4',
      title: 'Google SDE Internship Resume ATS Scan & Submission',
      course: 'Career Hub',
      dueDate: 'Sep 05, 2026',
      hoursLeft: 144,
      priority: 'low' as const,
      type: 'career' as const,
    },
  ],
  weeklyAnalytics: [
    { name: 'Mon', hours: 4.5, aiQueries: 4, quizScore: 88, retentionRate: 85, codingMinutes: 45 },
    { name: 'Tue', hours: 6.0, aiQueries: 8, quizScore: 92, retentionRate: 90, codingMinutes: 75 },
    { name: 'Wed', hours: 3.5, aiQueries: 3, quizScore: 86, retentionRate: 82, codingMinutes: 30 },
    { name: 'Thu', hours: 7.5, aiQueries: 12, quizScore: 95, retentionRate: 94, codingMinutes: 90 },
    { name: 'Fri', hours: 5.0, aiQueries: 6, quizScore: 90, retentionRate: 89, codingMinutes: 60 },
    { name: 'Sat', hours: 3.0, aiQueries: 2, quizScore: 94, retentionRate: 91, codingMinutes: 40 },
    { name: 'Sun', hours: 5.0, aiQueries: 5, quizScore: 96, retentionRate: 93, codingMinutes: 60 },
  ],
  analyticsByRange: {
    '7d': [
      { name: 'Mon', hours: 4.5, aiQueries: 4, quizScore: 88, retentionRate: 85, codingMinutes: 45 },
      { name: 'Tue', hours: 6.0, aiQueries: 8, quizScore: 92, retentionRate: 90, codingMinutes: 75 },
      { name: 'Wed', hours: 3.5, aiQueries: 3, quizScore: 86, retentionRate: 82, codingMinutes: 30 },
      { name: 'Thu', hours: 7.5, aiQueries: 12, quizScore: 95, retentionRate: 94, codingMinutes: 90 },
      { name: 'Fri', hours: 5.0, aiQueries: 6, quizScore: 90, retentionRate: 89, codingMinutes: 60 },
      { name: 'Sat', hours: 3.0, aiQueries: 2, quizScore: 94, retentionRate: 91, codingMinutes: 40 },
      { name: 'Sun', hours: 5.0, aiQueries: 5, quizScore: 96, retentionRate: 93, codingMinutes: 60 },
    ],
    '30d': [
      { name: 'Week 1', hours: 28.5, aiQueries: 24, quizScore: 87, retentionRate: 84, codingMinutes: 320 },
      { name: 'Week 2', hours: 34.0, aiQueries: 38, quizScore: 91, retentionRate: 89, codingMinutes: 410 },
      { name: 'Week 3', hours: 31.5, aiQueries: 30, quizScore: 89, retentionRate: 90, codingMinutes: 360 },
      { name: 'Week 4', hours: 38.0, aiQueries: 45, quizScore: 94, retentionRate: 95, codingMinutes: 480 },
    ],
    '90d': [
      { name: 'June 2026', hours: 118, aiQueries: 95, quizScore: 85, retentionRate: 82, codingMinutes: 1240 },
      { name: 'July 2026', hours: 142, aiQueries: 140, quizScore: 89, retentionRate: 88, codingMinutes: 1680 },
      { name: 'Aug 2026', hours: 156, aiQueries: 175, quizScore: 93, retentionRate: 94, codingMinutes: 1920 },
    ],
    '1y': [
      { name: 'Autumn 2025 (Sem 3)', hours: 380, aiQueries: 260, quizScore: 84, retentionRate: 81, codingMinutes: 4200 },
      { name: 'Spring 2026 (Sem 4)', hours: 425, aiQueries: 430, quizScore: 89, retentionRate: 87, codingMinutes: 5100 },
      { name: 'Autumn 2026 (Sem 5)', hours: 460, aiQueries: 580, quizScore: 93, retentionRate: 94, codingMinutes: 5800 },
    ],
  },
  studyDistribution: [
    { category: 'Core CS Theory (DBMS & OS)', hours: 14.5, percentage: 42, color: '#2F5D50' },
    { category: 'Algorithms & Problem Sets', hours: 9.0, percentage: 26, color: '#5B7FDE' },
    { category: 'AI Notes & Exam Synthesis', hours: 6.5, percentage: 19, color: '#F2C14E' },
    { category: 'Placement & Career Prep', hours: 4.5, percentage: 13, color: '#8A8D85' },
  ],
  accuracyTrend: [
    { topic: 'SQL & Indexing', actualScore: 96, targetScore: 90, cohortAvg: 78 },
    { topic: 'Process & Semaphores', actualScore: 91, targetScore: 90, cohortAvg: 74 },
    { topic: 'Graph & DP Algorithms', actualScore: 88, targetScore: 90, cohortAvg: 69 },
    { topic: 'TCP/IP & Routing', actualScore: 84, targetScore: 85, cohortAvg: 72 },
    { topic: 'System Design Patterns', actualScore: 90, targetScore: 85, cohortAvg: 75 },
  ],
  subjectComparison: [
    { subject: 'DBMS (CS-301)', score: 94, target: 90, attendance: 92 },
    { subject: 'Algorithms (CS-302)', score: 88, target: 85, attendance: 86 },
    { subject: 'OS (CS-303)', score: 91, target: 90, attendance: 90 },
    { subject: 'CN (CS-304)', score: 82, target: 85, attendance: 84 },
    { subject: 'Software Eng (CS-305)', score: 90, target: 85, attendance: 96 },
  ],
  aiActivities: [
    {
      id: 'ai-1',
      title: 'Operating Systems Unit 4 Process Sync & Deadlocks',
      type: 'AI NOTES SUMMARIZER',
      action: 'Synthesized 64-page lecture slide deck into 4-page target sheet',
      tokensUsed: 240,
      duration: '1.2s',
      status: 'completed' as const,
      timestamp: '2026-08-30T16:30:00.000Z',
    },
    {
      id: 'ai-2',
      title: 'DBMS Normalization & Relational Algebra 20 MCQs',
      type: 'AI QUIZ GENERATOR',
      action: 'Generated adaptive test simulation with answer rationale',
      tokensUsed: 180,
      duration: '0.8s',
      status: 'cached' as const,
      timestamp: '2026-08-30T14:15:00.000Z',
    },
    {
      id: 'ai-3',
      title: 'Software Engineer Resume v3 ATS Keyword Scan',
      type: 'AI RESUME ANALYZER',
      action: 'ATS match score 88/100 · 4 keyword adjustments recommended',
      tokensUsed: 120,
      duration: '1.5s',
      status: 'completed' as const,
      timestamp: '2026-08-29T19:00:00.000Z',
    },
  ],
  recentActivities: [
    {
      id: 'act-1',
      type: 'quiz_completed' as const,
      title: 'Completed "Database Normalization Quiz" with 92% score',
      course: 'CS-301',
      meta: '18/20 correct · 14m 20s duration',
      timestamp: '2026-08-30T16:30:00.000Z',
    },
    {
      id: 'act-2',
      type: 'resource_uploaded' as const,
      title: 'Uploaded "Operating Systems Unit 4 Hand-written Notes"',
      course: 'CS-303',
      meta: 'Verified by Faculty · 142 student views',
      timestamp: '2026-08-29T14:15:00.000Z',
    },
    {
      id: 'act-3',
      type: 'mentorship_accepted' as const,
      title: 'Rohit Verma (Google SDE) accepted your 1-on-1 mentorship request',
      course: 'Alumni Connect',
      meta: 'Scheduled for Saturday, 5:00 PM',
      timestamp: '2026-08-28T11:00:00.000Z',
    },
    {
      id: 'act-4',
      type: 'attendance_verified' as const,
      title: 'Weekly Attendance Ledger Synced: 89.5% Overall Standing',
      course: 'Department Office',
      meta: 'All courses cleared above 75% threshold',
      timestamp: '2026-08-28T09:00:00.000Z',
    },
  ],
  leaderboard: [
    {
      rank: 1,
      name: 'Aarav Sharma',
      avatar: 'AS',
      branch: 'Computer Science (CS-B)',
      semester: 'Sem 5',
      streakDays: 24,
      points: 2840,
      verified: true,
    },
    {
      rank: 2,
      name: 'Sneha Patel',
      avatar: 'SP',
      branch: 'Computer Science (CS-B)',
      semester: 'Sem 5',
      streakDays: 18,
      points: 2620,
      isCurrentUser: true,
      verified: true,
    },
    {
      rank: 3,
      name: 'Rohan Gupta',
      avatar: 'RG',
      branch: 'Computer Science (CS-A)',
      semester: 'Sem 5',
      streakDays: 14,
      points: 2450,
      verified: true,
    },
    {
      rank: 4,
      name: 'Priya Sundaram',
      avatar: 'PS',
      branch: 'Information Technology',
      semester: 'Sem 5',
      streakDays: 12,
      points: 2310,
      verified: true,
    },
  ],
  upcomingSchedules: [
    {
      id: 'sch-1',
      title: 'DBMS End-Sem Midterm Review & Lab Prep',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      type: 'revision',
    },
    {
      id: 'sch-2',
      title: 'Graph Algorithms Practice on Coding Hub',
      startTime: '02:00 PM',
      endTime: '03:30 PM',
      type: 'practice',
    },
  ],
  recommendedResources: [
    {
      id: 'res-101',
      title: 'DBMS Normalization & B+ Tree Notes by Topper',
      subject: 'CS-301 Database Systems',
      type: 'notes',
      likesCount: 142,
    },
    {
      id: 'res-102',
      title: 'Computer Networks 2025 PYQ with Answer Keys',
      subject: 'CS-304 Computer Networks',
      type: 'pyq',
      likesCount: 98,
    },
  ],
};

export const mockFacultyDashboard = {
  stats: {
    activeClasses: 3,
    totalStudents: 148,
    pendingEvaluations: 5,
    resourcesUploaded: 22,
  },
  recentSubmissions: [
    {
      id: 'sub-1',
      studentName: 'Aravind Sharma',
      assignmentTitle: 'B-Tree Indexing Implementation in C++',
      submittedAt: '2026-08-29T20:10:00.000Z',
    },
    {
      id: 'sub-2',
      studentName: 'Sneha Patel',
      assignmentTitle: 'SQL Query Optimization Lab Assignment',
      submittedAt: '2026-08-29T19:45:00.000Z',
    },
  ],
};

export const mockAdminDashboard = {
  stats: {
    totalUsers: 1420,
    activeUsersToday: 412,
    flaggedResources: 2,
    totalAiInferences: 12850,
  },
  systemHealth: {
    redis: true,
    worker: true,
    db: true,
  },
};

