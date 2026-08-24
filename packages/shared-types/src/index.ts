export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export type UserRole = 'student' | 'faculty' | 'alumni' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenUsage {
  used: number;
  limit: number;
  resetAt: string;
}
