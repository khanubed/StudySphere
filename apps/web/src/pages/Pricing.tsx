import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Essential academic tools for individual learners.',
      icon: Zap,
      features: [
        '50 AI Credits / month',
        'Basic Note Summarization',
        'Standard Flashcard & Quiz Generation',
        'Resource Hub Access',
        'Community Support',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Pro (Student)',
      price: '$9.99',
      period: 'per month',
      description: 'Advanced AI capabilities and full career prep tools.',
      icon: Sparkles,
      features: [
        '1,000 AI Credits / month',
        'Unlimited AI Document Summarization',
        'Full AI Resume Analyzer & ATS Score',
        'Live Quiz & Practice Rooms',
        'Full Coding Hub with AI Code Reviews',
        'Priority Support',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Institution',
      price: 'Custom',
      period: 'tailored per campus',
      description: 'Unified ecosystem for colleges, faculty, and departments.',
      icon: Building2,
      features: [
        'Pooled Campus AI Token Pool',
        'Faculty Portal & Automated Analytics',
        'Official Course Resource Hubs',
        'Verified Alumni Network Integration',
        'SSO / LMS Integration (Canvas, Moodle)',
        'Dedicated Account Manager',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full">
            Transparent Pricing
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Supercharge Your Learning with AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your academic journey. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border flex flex-col justify-between transition-all relative bg-card ${
                  plan.highlighted
                    ? 'border-primary shadow-xl ring-2 ring-primary/20 scale-105'
                    : 'border-border shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
                    Most Popular
                  </span>
                )}
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 text-sm mb-8 border-t border-border pt-6">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/register"
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-md'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
