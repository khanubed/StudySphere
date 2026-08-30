export const mockStudentDashboard = {
  stats: {
    studyStreakDays: 7,
    attendancePercentage: 89.5,
    completedQuizzes: 14,
    upcomingAssignments: 2,
    aiTokensRemaining: 880,
  },
  recentActivities: [
    {
      id: 'act-1',
      type: 'quiz_completed',
      title: 'Completed "Database Normalization Quiz" with 92% score',
      timestamp: '2026-08-29T16:30:00.000Z',
    },
    {
      id: 'act-2',
      type: 'resource_uploaded',
      title: 'Uploaded "Operating Systems Unit 4 Notes"',
      timestamp: '2026-08-28T14:15:00.000Z',
    },
    {
      id: 'act-3',
      type: 'mentorship_accepted',
      title: 'Rohit Verma accepted your mentorship request',
      timestamp: '2026-08-27T11:00:00.000Z',
    },
  ],
  upcomingSchedules: [
    {
      id: 'sch-1',
      title: 'DBMS End-Sem Midterm Review',
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
