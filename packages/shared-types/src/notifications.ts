import { BaseEntity } from './common.js';
import { NotificationCategory } from './user.js';

export type NotificationChannel = 'in_app' | 'email' | 'push';

export type NotificationType =
  | 'assignment_deadline'
  | 'quiz_published'
  | 'resource_approved'
  | 'resource_rejected'
  | 'resource_comment'
  | 'mentorship_request'
  | 'connection_request'
  | 'connection_accepted'
  | 'token_limit_warning'
  | 'announcement'
  | 'system_alert';

export interface AppNotification extends BaseEntity {
  userId: string;
  category: NotificationCategory;
  type: NotificationType | string;
  title: string;
  body: string;
  isRead: boolean;
  channel: NotificationChannel;
  actionUrl?: string | null;
  meta?: Record<string, any> | null;
}
