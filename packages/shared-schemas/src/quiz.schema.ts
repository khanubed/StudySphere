import { z } from 'zod';

export const startAttemptSchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID'),
});

export const submitAnswerSchema = z.object({
  attemptId: z.string().uuid('Invalid attempt ID'),
  questionId: z.string().uuid('Invalid question ID'),
  selectedAnswer: z.union([z.string(), z.array(z.string())]),
});

export const submitAttemptSchema = z.object({
  attemptId: z.string().uuid('Invalid attempt ID'),
});

export const facultyCreateQuizSchema = z.object({
  subjectId: z.string().uuid('Invalid subject ID'),
  source: z.enum(['ai', 'manual']),
  questionTypes: z.array(z.enum(['mcq', 'fill_blank', 'short_answer', 'true_false'])).min(1, 'Select at least one question type'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionCount: z.number().int().min(1, 'At least 1 question').max(100, 'At most 100 questions'),
  timeLimitMinutes: z.number().int().min(1).max(180).optional(),
});

export type StartAttemptInput = z.infer<typeof startAttemptSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;
export type FacultyCreateQuizInput = z.infer<typeof facultyCreateQuizSchema>;
