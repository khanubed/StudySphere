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
export type QuizQuestionType = 'mcq' | 'fill_blank' | 'short_answer' | 'true_false';
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
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  timeTakenSeconds: number;
  answers: {
    questionId: string;
    prompt: string;
    selectedAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    explanation?: string;
  }[];
}
