import { BaseEntity } from './common.js';
import { UserProfile } from './user.js';

export type ResourceType =
  | 'notes'
  | 'pyq'
  | 'book'
  | 'presentation'
  | 'assignment'
  | 'lab_manual'
  | 'research_paper';

export type ResourceStatus = 'pending' | 'published' | 'changes_requested' | 'rejected';

export interface ResourceFileMetadata {
  driveFileId: string;
  fileName: string;
  fileSizeFormatted?: string;
  mimeType?: string;
}

export interface Resource extends BaseEntity {
  uploadedBy: string;
  uploader?: UserProfile;
  subjectId: string;
  semester?: number;
  title: string;
  type: ResourceType;
  fileUrl?: string | null;
  driveLink?: string | null;
  fileMetadata?: ResourceFileMetadata;
  tags?: string[];
  description?: string | null;
  status: ResourceStatus;
  verifiedBy?: string | null;
  rejectionReason?: string | null;
  moderationFeedback?: string | null;
  likesCount?: number;
  bookmarksCount?: number;
  downloadsCount?: number;
  commentsCount?: number;
}

export interface ResourceLike {
  id: string;
  resourceId: string;
  userId: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  resourceId: string;
  userId: string;
  createdAt: string;
}

export type CommentStatus = 'visible' | 'flagged' | 'removed';

export interface Comment extends BaseEntity {
  resourceId: string;
  userId: string;
  user?: UserProfile;
  content: string;
  status: CommentStatus;
}

export type ContributorAction = 'upload' | 'download' | 'like_received' | 'featured';

export interface ContributorPoints {
  id: string;
  userId: string;
  resourceId?: string | null;
  action: ContributorAction;
  points: number;
  createdAt: string;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Badge {
  id: string;
  userId: string;
  tier: BadgeTier;
  awardedAt: string;
}

export type LeaderboardScope = 'daily' | 'weekly' | 'monthly' | 'allTime';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    branch?: string;
    semester?: string;
  };
  points: number;
  badge?: BadgeTier;
  resourcesCount?: number;
  downloadsGenerated?: number;
  verified?: boolean;
}
