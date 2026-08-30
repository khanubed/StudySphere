import { BaseEntity } from './common.js';
import { UserProfile } from './user.js';

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface AttendanceRecord extends BaseEntity {
  userId: string;
  subjectId: string;
  date: string;
  status: AttendanceStatus;
}

export interface Assignment extends BaseEntity {
  subjectId: string;
  createdBy: string;
  creator?: UserProfile;
  title: string;
  description: string;
  deadline: string;
  marks: number;
}

export interface AIFeedback {
  grammarScore?: number;
  readabilityScore?: number;
  suggestions?: string[];
  citationIssues?: string[];
  detailedNotes?: string;
}

export interface AssignmentSubmission extends BaseEntity {
  assignmentId: string;
  userId: string;
  user?: UserProfile;
  content?: string | null;
  fileUrl?: string | null;
  submittedAt: string;
  aiFeedback?: AIFeedback | null;
  grade?: number | null;
  facultyFeedback?: string | null;
}

export type QuizSource = 'ai' | 'manual';
export type QuizQuestionType = 'mcq' | 'fill_blank' | 'short_answer' | 'true_false' | 'conceptual';
export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestion extends BaseEntity {
  quizId: string;
  type: QuizQuestionType;
  prompt: string;
  options?: QuizQuestionOption[] | string[] | null;
  correctAnswer?: string | string[] | null;
  explanation?: string | null;
  topicTag?: string | null;
  marks?: number;
  difficulty?: QuizDifficulty;
  citation?: string | null;
}

export interface Quiz extends BaseEntity {
  subjectId?: string | null;
  createdBy: string;
  creator?: UserProfile;
  title?: string;
  source: QuizSource;
  questionCount: number;
  difficulty: QuizDifficulty;
  timeLimitMinutes?: number | null;
  questions?: QuizQuestion[];
  tokensUsed?: number;
  topicsCovered?: string[];
}

export interface QuizAttemptAnswer {
  id?: string;
  attemptId: string;
  questionId: string;
  selectedAnswer: string | string[];
  isCorrect?: boolean | null;
}

export interface QuizAttempt extends BaseEntity {
  quizId: string;
  quiz?: Quiz;
  userId: string;
  score?: number | null;
  accuracy?: number | null;
  startedAt: string;
  submittedAt?: string | null;
  answers?: QuizAttemptAnswer[];
  timeTakenSeconds?: number;
}

export interface WeakTopicAnalysis {
  topic: string;
  totalQuestions: number;
  correctCount: number;
  accuracyPercentage: number;
  masteryStatus: 'mastered' | 'proficient' | 'needs_revision';
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  quizTitle?: string;
  score: number;
  totalMarks?: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount?: number;
  skippedCount?: number;
  accuracy: number;
  timeTakenSeconds: number;
  percentile?: number;
  rank?: number;
  weakTopics?: WeakTopicAnalysis[];
  answers: {
    questionId: string;
    prompt: string;
    type?: QuizQuestionType;
    selectedAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    explanation?: string;
    topicTag?: string;
    citation?: string;
  }[];
}

export interface QuizGenerationRequest {
  source: 'upload' | 'resource' | 'topic_text';
  sourceRef: string;
  fileName?: string;
  questionTypes: QuizQuestionType[];
  difficulty: QuizDifficulty;
  questionCount: number;
  timeLimitMinutes?: number;
}
