import { BaseEntity } from './common.js';

export type UserRole = 'student' | 'faculty' | 'admin' | 'alumni';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string | null;
  isVerified: boolean;
  isActive: boolean;
  googleId?: string | null;
}

export interface Institution extends BaseEntity {
  name: string;
  domain?: string | null;
}

export interface Branch extends BaseEntity {
  institutionId: string;
  name: string;
}

export interface Semester extends BaseEntity {
  branchId: string;
  number: number;
}

export interface Subject extends BaseEntity {
  semesterId: string;
  name: string;
  code: string;
}

export interface StudentProfile {
  userId: string;
  branchId?: string | null;
  semesterId?: string | null;
  cgpa?: number | null;
  attendancePct?: number | null;
}

export interface FacultyProfile {
  userId: string;
  department: string;
  designation: string;
  experienceYears?: number | null;
}

export interface AlumniProfile {
  userId: string;
  graduationYear: number;
  currentCompany?: string | null;
  designation?: string | null;
  skills: string[];
  isVerified: boolean;
}

export type ProfileVisibility = 'public' | 'institution_only' | 'private';

export interface UserPrivacySettings {
  profileVisibility: ProfileVisibility;
  showContactInfo: boolean;
  showAcademicStats: boolean;
}

export type NotificationCategory = 'academic' | 'social' | 'career' | 'billing' | 'moderation' | 'system';

export interface NotificationChannelPreferences {
  inApp: true; // in-app cannot be disabled
  email: boolean;
  push: boolean;
}

export interface NotificationPreferences {
  category: NotificationCategory;
  channels: NotificationChannelPreferences;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: string | null;
  institution?: Institution | null;
  studentProfile?: StudentProfile | null;
  facultyProfile?: FacultyProfile | null;
  alumniProfile?: AlumniProfile | null;
  privacySettings?: UserPrivacySettings | null;
  createdAt: string;
  updatedAt?: string;
}
