import { BaseEntity } from './common.js';
import { QuizDifficulty, QuizQuestion } from './academic.js';

export type LiveQuizState = 'lobby' | 'active' | 'question_ended' | 'completed';

export interface LiveQuizParticipant {
  userId: string;
  name: string;
  avatarUrl?: string;
  score: number;
  joinedAt: string;
  isReady?: boolean;
}

export interface LiveQuizSession extends BaseEntity {
  hostId: string;
  topic: string;
  difficulty: QuizDifficulty;
  questionCount: number;
  joinCode: string;
  state: LiveQuizState;
  currentQuestionIndex: number;
  timePerQuestionSec: number;
  questions?: QuizQuestion[];
  participants?: LiveQuizParticipant[];
}

export interface LiveQuizAnswer {
  sessionId: string;
  questionId: string;
  userId: string;
  selectedAnswer: string;
  answeredAtMs: number;
  pointsAwarded?: number;
  isCorrect?: boolean;
}

export interface LiveQuizLeaderboardItem {
  rank: number;
  userId: string;
  name: string;
  score: number;
  streak?: number;
}

export type LiveQuizWebSocketEvent =
  | { type: 'PARTICIPANT_JOINED'; participant: LiveQuizParticipant }
  | { type: 'PARTICIPANT_LEFT'; userId: string }
  | { type: 'SESSION_START'; totalQuestions: number }
  | { type: 'NEXT_QUESTION'; questionIndex: number; question: QuizQuestion; timeLimitSec: number }
  | { type: 'QUESTION_TIMEOUT'; correctAnswer: string; explanation?: string }
  | { type: 'LEADERBOARD_UPDATE'; leaderboard: LiveQuizLeaderboardItem[] }
  | { type: 'QUIZ_ENDED'; finalLeaderboard: LiveQuizLeaderboardItem[] };
