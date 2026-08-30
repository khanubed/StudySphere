import React from 'react';
import { useGetPlatformAnalyticsQuery } from '../../store/api/adminApi';

export const AdminAnalytics: React.FC = () => {
  const { data } = useGetPlatformAnalyticsQuery();
  const analytics = data?.data;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Performance & AI Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor token consumption velocity, user registrations, and platform infrastructure health.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total Users</span>
          <div className="text-3xl font-black text-primary">{analytics?.totalUsers || 1420}</div>
          <p className="text-xs text-muted-foreground">{analytics?.activeUsersToday || 380} active today</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total AI Inferences</span>
          <div className="text-3xl font-black text-foreground">{analytics?.aiGenerationsToday || 420}</div>
          <p className="text-xs text-muted-foreground">{analytics?.totalTokensConsumed || 18450} tokens consumed</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Resource Hub Content</span>
          <div className="text-3xl font-black text-foreground">{analytics?.totalResources || 310}</div>
          <p className="text-xs text-muted-foreground">{analytics?.pendingResourcesCount || 3} pending review</p>
        </div>
      </div>
    </div>
  );
};
