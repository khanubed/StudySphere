import { z } from 'zod';

export const updateSessionSchema = z
  .object({
    sessionId: z.string().uuid('Invalid session ID'),
    action: z.enum(['mark_done', 'reschedule']),
    newTime: z.coerce.date().optional(),
  })
  .refine((d) => d.action !== 'reschedule' || Boolean(d.newTime), {
    message: 'Provide a new time to reschedule',
    path: ['newTime'],
  });

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
  dueDate: z.coerce.date(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  subjectId: z.string().uuid('Invalid subject ID').optional().or(z.literal('')),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
