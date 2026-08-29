import { BaseEntity } from './common.js';

export type PlanTier = 'free' | 'pro' | 'institution';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due';

export interface Plan extends BaseEntity {
  name: PlanTier;
  monthlyPrice: number;
  aiTokenLimit: number;
  features: Record<string, boolean>;
}

export interface Subscription extends BaseEntity {
  userId: string;
  planId: string;
  plan?: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  paymentProviderRef?: string | null;
}

export interface TokenWeight extends BaseEntity {
  actionType: string;
  weight: number;
}

export interface TokenUsageRecord extends BaseEntity {
  userId?: string | null;
  institutionId?: string | null;
  periodStart: string;
  periodEnd: string;
  tokensUsed: number;
  tokensLimit: number;
}

export interface CheckoutSessionPayload {
  sessionId: string;
  checkoutUrl: string;
}
