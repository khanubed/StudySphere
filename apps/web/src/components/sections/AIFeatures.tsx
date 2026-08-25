import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureChain {
  label: string;
  headline: string;
  description: string;
  steps: string[];
}

const chains: FeatureChain[] = [
  {
    label: 'AI NOTES SUMMARIZER',
    headline: 'Turn 80 pages of lecture notes into 5 minutes of targeted revision.',
    description: 'Upload handouts, PDFs, and slide decks. The parser extracts core logic, drafts summarized guidelines, and builds adaptive flashcards automatically.',
    steps: ['PDF Handout', 'Core Summary', 'Flashcards', 'Revision Notes'],
  },
  {
    label: 'AI QUIZ GENERATOR',
    headline: 'Transform any reference syllabus into live test simulations.',
    description: 'Input any syllabus text or textbook chapter. The compiler constructs custom MCQs and short-answer prompts to test your retention and recall.',
    steps: ['Syllabus Topic', 'Custom Questions', 'Performance Score', 'Weak Area Matrix'],
  },
  {
    label: 'AI RESUME ANALYZER',
    headline: 'Reconstruct your project history for ATS ranking systems.',
    description: 'Verify keyword densities, active verb ratios, and layout markers. Get customized bullet adjustments to align directly with placement guidelines.',
    steps: ['Raw Resume', 'ATS Evaluation', 'Bullet Improvements', 'Placement Readiness'],
  },
];

export const AIFeatures: React.FC = () => {
  return (
    <section id="ai-features" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-chalk tracking-widest uppercase mb-4 block">
            04 — SEMANTIC AI STACK
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            Zero friction synthesis.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            AI-driven tools configured to eliminate routine transcription and indexing. Every transformation displays a Chalk-blue sequence.
          </p>
        </div>

        {/* Feature Transformations */}
        <div className="space-y-16">
          {chains.map((chain) => (
            <div 
              key={chain.label}
              className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-12 border-b border-border/40 last:border-b-0"
            >
              {/* Left Side: Outcome Headline & Descriptions */}
              <div className="lg:col-span-6 text-left">
                <span className="font-mono text-[11px] font-semibold text-chalk tracking-wider uppercase mb-3 block">
                  SYSTEM MOD: {chain.label}
                </span>
                
                <h3 className="font-display text-ink font-bold text-[24px] sm:text-[28px] leading-[1.2] mb-4">
                  {chain.headline}
                </h3>
                
                <p className="font-body text-[14px] md:text-[15px] text-graphite leading-relaxed">
                  {chain.description}
                </p>
              </div>

              {/* Right Side: Horizontal Transformation Chain (Chalk Blue Accent) */}
              <div className="lg:col-span-6 flex flex-wrap items-center gap-3 bg-secondary/10 p-6 rounded-[6px] border border-border/30">
                {chain.steps.map((step, stepIdx) => (
                  <React.Fragment key={step}>
                    
                    {/* Step Capsule */}
                    <div className="border border-chalk/40 bg-chalk/5 text-chalk font-mono text-[12px] font-semibold px-3.5 py-2 rounded-[4px] tracking-wide uppercase shadow-sm">
                      {step}
                    </div>

                    {/* Chalk Blue Transition Arrow */}
                    {stepIdx < chain.steps.length - 1 && (
                      <div className="text-chalk flex items-center justify-center flex-shrink-0 animate-pulse" aria-hidden="true">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}

                  </React.Fragment>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
