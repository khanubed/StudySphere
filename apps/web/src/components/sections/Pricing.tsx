import React from 'react';
import { Link } from 'react-router-dom';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  recommended?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'FREE',
    price: '$0',
    period: 'forever',
    description: 'Core access for individual self-study sessions.',
    features: [
      'Basic study profile',
      'Shared Resource Hub catalog',
      'Up to 1,000 monthly AI tokens',
      'Standard notes summarizer',
      'Self-practice quiz modules',
    ],
    ctaLabel: 'Start Free',
    ctaHref: '/register',
  },
  {
    name: 'PRO STUDENT',
    price: '$6',
    period: 'per month',
    description: 'Consolidated preparation for placements and exams.',
    features: [
      'Everything in Free tier',
      'Up to 50,000 monthly AI tokens',
      'Advanced ATS Resume Analyzer',
      'Priority live quiz Compete',
      'Alumni connection directory routing',
      'Streaks and priority analytics',
    ],
    recommended: true,
    ctaLabel: 'Go Pro Student',
    ctaHref: '/register',
  },
  {
    name: 'INSTITUTION',
    price: 'Custom',
    period: 'billed annually',
    description: 'Full-scale campus ecosystem for faculties and coordinators.',
    features: [
      'Unlimited student seats',
      'Pooled organizational AI tokens',
      'Complete Faculty Portal features',
      'Unified class cohort analytics',
      'Recruiter vacancy priority hub',
      'Direct system API integrations',
    ],
    ctaLabel: 'Contact Sales',
    ctaHref: '/contact',
  },
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
            10 — ACADEMIC FEES
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            Transparent academic pricing.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            Free core utilities with affordable token tiers. No hidden charges or automatic rollover hooks.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`bg-paper rounded-[8px] p-6 text-left flex flex-col justify-between min-h-[480px] transition-all duration-150 ${
                tier.recommended 
                  ? 'border-2 border-quad shadow-sm' 
                  : 'border border-border/80 shadow-none'
              }`}
            >
              <div>
                
                {/* Recommended Tag (Mono text label, not scaled, no ribbons) */}
                {tier.recommended && (
                  <span className="font-mono text-[9px] md:text-[10px] font-bold text-quad uppercase tracking-widest block mb-4">
                    [ MOST STUDENTS CHOOSE THIS ]
                  </span>
                )}

                {/* Plan Name */}
                <span className="font-mono text-[11px] font-bold text-graphite tracking-widest block mb-2">
                  {tier.name}
                </span>

                {/* Price Display */}
                <div className="font-mono text-3xl md:text-4xl font-bold text-ink leading-none mb-3">
                  {tier.price}
                  <span className="text-graphite font-normal text-[12px] md:text-[13px] tracking-normal ml-1.5 lowercase">
                    {tier.period}
                  </span>
                </div>

                {/* Description */}
                <p className="font-body text-[13px] md:text-[14px] text-graphite leading-relaxed mb-6 border-b border-border/40 pb-4">
                  {tier.description}
                </p>

                {/* Features Checklist */}
                <ul className="space-y-3 font-mono text-[12px] text-ink/90 leading-none">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <span className="text-quad font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Action Button */}
              <div className="mt-8">
                <Link
                  to={tier.ctaHref}
                  className={`w-full text-center block font-sans text-[14px] font-semibold py-3 rounded-[6px] transition-colors duration-200 ${
                    tier.recommended 
                      ? 'bg-quad text-paper hover:opacity-95' 
                      : 'border border-border hover:border-quad text-ink hover:text-quad'
                  }`}
                >
                  {tier.ctaLabel}
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
