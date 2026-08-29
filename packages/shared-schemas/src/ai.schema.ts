import { z } from 'zod';

export const summarizeRequestSchema = z.object({
  sourceFileUrl: z.string().url('Must be a valid file URL'),
  depth: z.enum(['short', 'detailed', 'both']).default('both'),
  includeFlashcards: z.boolean().default(false),
  includeMindMap: z.boolean().default(false),
});

export const quizGenerateSchema = z.object({
  source: z.enum(['upload', 'resource', 'topic_text']),
  sourceRef: z.string().min(1, 'Source reference is required'),
  questionTypes: z.array(z.enum(['mcq', 'fill_blank', 'short_answer', 'true_false'])).min(1, 'Select at least one question type'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
  questionCount: z.number().int().min(1, 'At least 1 question').max(50, 'At most 50 questions'),
  timeLimitMinutes: z.number().int().min(1).max(180).optional(),
});

export const assignmentAnalyzeSchema = z
  .object({
    text: z.string().trim().min(50, 'Text must be at least 50 characters').max(20000).optional().or(z.literal('')),
    fileUrl: z.string().url('Must be a valid file URL').optional().or(z.literal('')),
    citationStyle: z.enum(['APA', 'MLA', 'IEEE']).optional(),
  })
  .refine((d) => Boolean(d.text && d.text.length >= 50) || Boolean(d.fileUrl), {
    message: 'Submit at least 50 characters or provide a file URL',
    path: ['text'],
  });

export const resumeAnalyzeSchema = z.object({
  resumeFileUrl: z.string().url('Must be a valid resume file URL'),
  targetJobDescription: z.string().trim().max(5000).optional().or(z.literal('')),
  linkedInUrl: z.string().url('Must be a valid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Must be a valid portfolio URL').optional().or(z.literal('')),
});

export const plannerGenerateSchema = z
  .object({
    subjectIds: z.array(z.string().uuid('Invalid subject ID')).min(1, 'Select at least one subject'),
    examDates: z.record(z.string(), z.coerce.date()), // subjectId -> date
    hoursPerDay: z.number().min(0.5, 'Minimum 0.5 hours').max(16, 'Maximum 16 hours'),
  })
  .refine(
    (d) => Object.values(d.examDates).every((date) => date.getTime() > Date.now()),
    { message: 'Exam date must be in the future', path: ['examDates'] }
  );

export const codeReviewSchema = z.object({
  code: z.string().trim().min(1, 'Code snippet cannot be empty').max(20000, 'Code must be under 20000 characters'),
  language: z.string().min(1, 'Language is required').max(30),
});

export type SummarizeRequestInput = z.infer<typeof summarizeRequestSchema>;
export type QuizGenerateInput = z.infer<typeof quizGenerateSchema>;
export type AssignmentAnalyzeInput = z.infer<typeof assignmentAnalyzeSchema>;
export type ResumeAnalyzeInput = z.infer<typeof resumeAnalyzeSchema>;
export type PlannerGenerateInput = z.infer<typeof plannerGenerateSchema>;
export type CodeReviewInput = z.infer<typeof codeReviewSchema>;
