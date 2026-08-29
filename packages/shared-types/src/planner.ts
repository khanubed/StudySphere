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
