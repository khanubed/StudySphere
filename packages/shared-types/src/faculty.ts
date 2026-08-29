import { BaseEntity } from './common.js';
import { UserProfile } from './user.js';

export interface Announcement extends BaseEntity {
  authorId: string;
  author?: UserProfile;
  institutionId?: string | null;
  subjectId?: string | null;
  title: string;
  message: string;
  scheduledFor?: string | null;
  pinned: boolean;
}

export interface FacultySubjectAnalytics {
  subjectId: string;
  subjectName: string;
  enrolledStudentsCount: number;
  averageAttendancePct: number;
  assignmentsSubmittedCount: number;
  averageQuizScorePct: number;
}

export interface FacultyAnalytics {
  facultyId: string;
  totalStudents: number;
  totalQuizzesCreated: number;
  totalResourcesUploaded: number;
  subjectsAnalytics: FacultySubjectAnalytics[];
}
