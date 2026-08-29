import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['student', 'faculty', 'admin', 'alumni']),
});

export const suspendUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z.string().trim().min(5, 'Reason must be at least 5 characters').max(500),
});

export const updatePlanSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  monthlyPrice: z.number().min(0),
  aiTokenLimit: z.number().int().min(0),
  features: z.record(z.string(), z.boolean()),
});

export const updateTokenWeightSchema = z.object({
  actionType: z.string().min(1, 'Action type is required'),
  weight: z.number().int().min(0),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type UpdateTokenWeightInput = z.infer<typeof updateTokenWeightSchema>;
