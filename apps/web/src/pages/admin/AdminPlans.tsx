import React from 'react';
import { useGetPlansQuery } from '../../store/api/billingApi';
import { Edit, Zap } from 'lucide-react';

export const AdminPlans: React.FC = () => {
  const { data } = useGetPlansQuery();

  const plans = data?.data || [
    {
      id: 'plan-free',
      name: 'free' as const,
      monthlyPrice: 0,
      aiTokenLimit: 50,
      features: {},
      createdAt: '',
    },
    {
      id: 'plan-pro',
      name: 'pro' as const,
      monthlyPrice: 9.99,
      aiTokenLimit: 1000,
      features: {},
      createdAt: '',
    },
    {
      id: 'plan-inst',
      name: 'institution' as const,
      monthlyPrice: 499,
      aiTokenLimit: 100000,
      features: {},
      createdAt: '',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Token Quota & Plan Config</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust token allowances and pricing across tiers without requiring application redeploys.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg uppercase">{p.name} Tier</h3>
              <Zap className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black">${p.monthlyPrice} /mo</div>
              <p className="text-xs text-muted-foreground">{p.aiTokenLimit.toLocaleString()} Monthly Credits</p>
            </div>

            <button className="w-full py-2 border border-border hover:bg-muted/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <Edit className="w-3.5 h-3.5" /> Edit Configuration
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
