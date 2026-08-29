import { z } from 'zod';

export const updateProblemStatusSchema = z.object({
  problemId: z.string().uuid('Invalid problem ID'),
  status: z.enum(['not_started', 'attempted', 'solved']),
});

export type UpdateProblemStatusInput = z.infer<typeof updateProblemStatusSchema>;
