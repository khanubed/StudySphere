import { BaseEntity } from './common.js';

export interface PlannerTask extends BaseEntity {
  userId: string;
  title: string;
  dueDate: string;
  isComplete: boolean;
  priority?: 'low' | 'medium' | 'high';
  subjectId?: string | null;
}

export interface StudyScheduleBlock {
  id: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  subjectId?: string;
  subjectName?: string;
  topic: string;
  activityType: 'reading' | 'practice' | 'revision' | 'mock_test';
  isCompleted?: boolean;
}

export interface StudySchedule extends BaseEntity {
  userId: string;
  subjectId?: string | null;
  generatedForDate: string;
  blocks: StudyScheduleBlock[];
}

export interface StudySession extends BaseEntity {
  userId: string;
  subjectId?: string | null;
  startedAt: string;
  endedAt?: string | null;
  durationMin?: number | null;
  notes?: string | null;
}

// ── ACADEMIC OS STUDY PLANNER & ADAPTIVE REVISION ENGINE TYPES ──────────────

export type StudyPatternType = 'morning' | 'evening' | 'balanced' | 'weekend';
export type SessionStatusType = 'upcoming' | 'completed' | 'skipped' | 'rescheduled';
export type SessionActivityType = 'study' | 'revision' | 'mock_quiz' | 'problem_set';

export interface StudySessionItem {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  topic: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  durationMinutes: number;
  type: SessionActivityType;
  status: SessionStatusType;
  completedAt?: string;
}

export interface WeeklyScheduleDay {
  day: string;
  date: string;
  totalHours: number;
  sessions: StudySessionItem[];
  priority: 'high' | 'medium' | 'normal';
}

export interface RevisionMilestone {
  subject: string;
  subjectCode: string;
  examDate: string;
  tMinus7Date: string;
  tMinus3Date: string;
  tMinus1Date: string;
  coveragePercentage: number;
  intensity: 'deep' | 'high_yield' | 'formula_recall';
}

export interface MockTestSuggestion {
  id: string;
  subject: string;
  subjectCode: string;
  topic: string;
  suggestedDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  durationMinutes: number;
  targetScore: number;
  reason: string;
}

export interface SubjectReadiness {
  id: string;
  subject: string;
  code: string;
  coveragePercentage: number;
  examDate: string;
  daysLeft: number;
  quizAccuracy: number;
  status: 'on_track' | 'needs_attention' | 'critical';
}

export interface StudyPlan extends BaseEntity {
  title: string;
  dailyHours: number;
  preferredPattern: StudyPatternType;
  readinessScore: number;
  streakDays: number;
  todaySessions: StudySessionItem[];
  weeklySchedule: WeeklyScheduleDay[];
  revisionMilestones: RevisionMilestone[];
  mockTestSuggestions: MockTestSuggestion[];
  subjectReadiness: SubjectReadiness[];
}

export interface GenerateStudyPlanRequest {
  subjects: Array<{
    id: string;
    name: string;
    code: string;
    examDate: string;
    weight?: number;
  }>;
  dailyHours: number;
  preferredPattern: StudyPatternType;
  syncQuizData?: boolean;
  autoMockTests?: boolean;
}
