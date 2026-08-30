import React from 'react';
import { useGetTokenUsageQuery } from '../store/api/aiApi';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Billing: React.FC = () => {
  const { data: subData } = useGetTokenUsageQuery();
  const tokenUsage = subData?.data;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing, Quotas & Token Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your AI inference credits and manage subscription tiers.
        </p>
      </div>

      {/* AI Token Usage Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Monthly Allowance</span>
            <h2 className="text-2xl font-bold">AI Compute Credits</h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-primary">
              {(tokenUsage?.limit || 1000) - (tokenUsage?.used || 120)}
            </span>
            <span className="text-xs text-muted-foreground block">Credits Remaining</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${Math.min(100, (((tokenUsage?.used || 120) / (tokenUsage?.limit || 1000)) * 100))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Used: {tokenUsage?.used || 120}</span>
            <span>Limit: {tokenUsage?.limit || 1000} credits</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
          >
            Upgrade Plan <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
