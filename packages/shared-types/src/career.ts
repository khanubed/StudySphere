import { BaseEntity } from './common.js';
import { UserProfile } from './user.js';

export type JobCategory =
  | 'software_development'
  | 'data_science'
  | 'design'
  | 'marketing'
  | 'other';

export type JobStatus = 'open' | 'closed';

export interface JobPosting extends BaseEntity {
  postedBy: string;
  poster?: UserProfile;
  title: string;
  company: string;
  category: JobCategory;
  description: string;
  requirements: string;
  isInternship: boolean;
  durationMonths?: number | null;
  stipend?: number | null;
  location?: string | null;
  isRemote: boolean;
  deadline: string;
  status: JobStatus;
  applicationsCount?: number;
}

export type JobApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'withdrawn';

export interface JobApplication extends BaseEntity {
  jobId: string;
  job?: JobPosting;
  userId: string;
  user?: UserProfile;
  resumeUrl?: string | null;
  status: JobApplicationStatus;
  appliedAt: string;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface UserConnection extends BaseEntity {
  requesterId: string;
  requester?: UserProfile;
  targetId: string;
  target?: UserProfile;
  status: ConnectionStatus;
}

export type MentorshipRequestStatus = 'pending' | 'accepted' | 'declined';

export interface MentorshipRequest extends BaseEntity {
  studentId: string;
  student?: UserProfile;
  alumniId: string;
  alumni?: UserProfile;
  message: string;
  status: MentorshipRequestStatus;
}
