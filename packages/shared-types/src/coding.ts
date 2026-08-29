import { BaseEntity } from './common.js';

export type CodingTrackSlug = 'dsa' | 'web-dev' | 'ai-ml' | 'core-subjects' | string;
export type ProblemDifficulty = 'easy' | 'medium' | 'hard';
export type SheetSource = 'a2z' | 'blind75' | 'neetcode' | 'custom';
export type ProblemStatus = 'not_started' | 'attempted' | 'solved';

export interface CodingTrack extends BaseEntity {
  name: string;
  slug: CodingTrackSlug;
  description?: string;
  topicsCount?: number;
  problemsCount?: number;
  solvedCount?: number;
}

export interface CodingTopic extends BaseEntity {
  trackId: string;
  name: string;
  slug: string;
  sortOrder: number;
  problems?: CodingProblem[];
}

export interface CodingProblem extends BaseEntity {
  topicId: string;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  companyTags: string[];
  sheetSource: SheetSource;
  externalUrl?: string | null;
  userStatus?: ProblemStatus;
}

export interface UserCodingProgress {
  id: string;
  userId: string;
  problemId: string;
  problem?: CodingProblem;
  status: ProblemStatus;
  solvedAt?: string | null;
}
