import { baseApi } from './baseApi';
import {
  Plan,
  Subscription,
  ApiResponse,
  CheckoutSessionPayload,
} from '@studysphere/shared-types';

export interface BillingUsageSummary {
  plan: Plan;
  subscription?: Subscription | null;
  tokensUsed: number;
  tokenLimit: number;
  resetDate: string;
  invoices?: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
    pdfUrl?: string;
  }>;
}

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<ApiResponse<Plan[]>, void>({
      query: () => '/billing/plans',
      providesTags: ['Billing'],
    }),
    getCurrentSubscription: builder.query<
      ApiResponse<Subscription | null>,
      void
    >({
      query: () => '/billing/subscription',
      providesTags: ['Billing'],
    }),
    getBillingUsage: builder.query<ApiResponse<BillingUsageSummary>, void>({
      query: () => '/billing/usage',
      providesTags: ['Billing'],
    }),
    createCheckoutSession: builder.mutation<
      ApiResponse<CheckoutSessionPayload>,
      { planId: string; billingCycle: 'monthly' | 'yearly' }
    >({
      query: (body) => ({
        url: '/billing/checkout-session',
        method: 'POST',
        body,
      }),
    }),
    cancelSubscription: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/billing/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['Billing'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPlansQuery,
  useGetCurrentSubscriptionQuery,
  useGetBillingUsageQuery,
  useCreateCheckoutSessionMutation,
  useCancelSubscriptionMutation,
} = billingApi;
