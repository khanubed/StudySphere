import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface JourneyStage {
  num: string;
  title: string;
  description: string;
}

const stages: JourneyStage[] = [
  { num: '01', title: 'Learn', description: 'Upload notes, lecture recordings, and reference readings directly to your hub.' },
  { num: '02', title: 'Understand', description: 'Generate high-fidelity AI summaries, concepts, and semantic flashcards.' },
  { num: '03', title: 'Practice', description: 'Test yourself with auto-generated adaptive quizzes and live group challenges.' },
  { num: '04', title: 'Improve', description: 'Track weak concepts and memory curves through visual performance matrices.' },
  { num: '05', title: 'Prepare', description: 'Build ATS-optimized resumes and run simulated peer/AI practice interviews.' },
  { num: '06', title: 'Grow', description: 'Connect with verified college alumni for direct mentorship and career referrals.' },
];

export const StudentJourney: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="journey" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
            02 — CORE FLOW
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            The student success engine.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            One continuous pipeline from your first day of class to your first day of work.
          </p>
        </div>

        {/* Desktop Layout: Horizontal Timeline */}
        <div className="hidden lg:block relative pt-6 pb-12">
          
          {/* Hairline Timeline Line */}
          <div className="absolute top-[28px] left-0 right-0 h-[1px] bg-border" aria-hidden="true" />
          
          <div className="grid grid-cols-6 gap-6 relative">
            {stages.map((stage, idx) => {
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={stage.num}
                  className="relative flex flex-col items-start cursor-default pt-2 group"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Timeline node */}
                  <div className="w-4 h-4 rounded-full border-2 border-border bg-paper z-10 transition-colors duration-300 group-hover:border-quad group-hover:bg-quad mb-6 relative">
                    {/* Pulsing indicator when hovered */}
                    {isHovered && !prefersReducedMotion && (
                      <span className="absolute inset-[-4px] border border-quad rounded-full animate-ping opacity-60" />
                    )}
                  </div>

                  {/* Stage Index & Title */}
                  <div className="font-mono text-[14px] font-semibold text-ink flex items-center gap-1.5 mb-3 leading-none">
                    <span className="text-quad font-bold">{stage.num}</span>
                    <span className="uppercase tracking-wider">{stage.title}</span>
                  </div>

                  {/* Stage Description */}
                  <p className="font-body text-[13px] md:text-[14px] text-graphite leading-relaxed mb-4 min-h-[72px]">
                    {stage.description}
                  </p>

                  {/* Underline draw-in element */}
                  <div className="relative w-full h-[2px] bg-transparent overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute inset-0 bg-quad origin-left"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Layout: Vertical Timeline */}
        <div className="lg:hidden relative pl-6">
          
          {/* Vertical Hairline Timeline Line */}
          <div className="absolute top-0 bottom-0 left-[7px] w-[1px] bg-border" aria-hidden="true" />
          
          <div className="space-y-12">
            {stages.map((stage, idx) => (
              <div
                key={stage.num}
                className="relative flex flex-col items-start pt-1 cursor-default group"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Timeline node */}
                <div className="absolute left-[-25px] top-[6px] w-[15px] h-[15px] rounded-full border-2 border-border bg-paper z-10 transition-colors duration-300 group-hover:border-quad group-hover:bg-quad" />

                {/* Stage Index & Title */}
                <div className="font-mono text-[14px] font-semibold text-ink flex items-center gap-1.5 mb-2 leading-none">
                  <span className="text-quad font-bold">{stage.num}</span>
                  <span className="uppercase tracking-wider">{stage.title}</span>
                </div>

                {/* Stage Description */}
                <p className="font-body text-[14px] text-graphite leading-relaxed max-w-xl pb-2">
                  {stage.description}
                </p>

                {/* Mobile underline draw-in */}
                <div className="w-full max-w-sm h-[1.5px] bg-border/20 relative mt-2">
                  <div className="absolute bottom-0 left-0 top-0 w-0 bg-quad group-hover:w-full transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
