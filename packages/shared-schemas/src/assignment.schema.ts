import { z } from 'zod';

export const submitAssignmentSchema = z
  .object({
    assignmentId: z.string().uuid('Invalid assignment ID'),
    content: z.string().trim().min(1, 'Content cannot be empty').optional().or(z.literal('')),
    fileUrl: z.string().url('Must be a valid file URL').optional().or(z.literal('')),
  })
  .refine((d) => Boolean(d.content) || Boolean(d.fileUrl), {
    message: 'Provide text content or a file',
    path: ['content'],
  });

export const createAssignmentSchema = z
  .object({
    subjectId: z.string().uuid('Invalid subject ID'),
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150, 'Title must be under 150 characters'),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
    deadline: z.coerce.date(),
    marks: z.number().int().min(1, 'Marks must be at least 1').max(1000, 'Marks must be at most 1000'),
  })
  .refine((d) => d.deadline.getTime() > Date.now(), {
    message: 'Deadline must be a future date',
    path: ['deadline'],
  });

export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
