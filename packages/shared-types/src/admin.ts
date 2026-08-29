import { BaseEntity } from './common.js';
import { UserProfile } from './user.js';

export interface AuditLog extends BaseEntity {
  adminId: string;
  admin?: UserProfile;
  action: string;
  entity: string;
  entityId: string;
  meta?: Record<string, any> | null;
}

export interface InstitutionConfig extends BaseEntity {
  institutionId: string;
  key: string;
  value: Record<string, any> | string | number | boolean;
}

export interface PlatformAnalytics {
  totalUsers: number;
  activeUsersToday: number;
  totalResources: number;
  pendingResourcesCount: number;
  aiGenerationsToday: number;
  totalTokensConsumed: number;
  revenueThisMonth: number;
}
