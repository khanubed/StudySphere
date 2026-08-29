import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  billingCycle: z.enum(['monthly', 'yearly']),
});

export const cancelSubscriptionSchema = z.object({
  reason: z.string().trim().max(500).optional().or(z.literal('')),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
