export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TokenUsage {
  used: number;
  limit: number;
  resetAt?: string;
  institutionPooled?: boolean;
}

export interface TokenLimitExceededError {
  success: false;
  message: string;
  code: 'TOKEN_LIMIT_EXCEEDED';
  used: number;
  limit: number;
  resetAt: string;
  suggestedPlan?: 'pro' | 'institution';
}

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
};
