import { z } from 'zod';

export const createLiveQuizSessionSchema = z.object({
  topic: z.string().trim().min(3, 'Topic must be at least 3 characters').max(150),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionCount: z.number().int().min(5, 'At least 5 questions').max(50, 'At most 50 questions'),
});

export const joinLiveQuizSchema = z.object({
  code: z.string().length(6, 'Enter a 6-character code').regex(/^[A-Z0-9]{6}$/i, 'Enter a valid 6-character alphanumeric code'),
});

export const liveQuizAnswerSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  questionId: z.string().uuid('Invalid question ID'),
  selectedAnswer: z.string().min(1, 'Answer is required'),
  answeredAtMs: z.number().int(),
});

export type CreateLiveQuizSessionInput = z.infer<typeof createLiveQuizSessionSchema>;
export type JoinLiveQuizInput = z.infer<typeof joinLiveQuizSchema>;
export type LiveQuizAnswerInput = z.infer<typeof liveQuizAnswerSchema>;
