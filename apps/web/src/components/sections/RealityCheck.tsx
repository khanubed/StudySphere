import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ToolItem {
  id: string;
  name: string;
  initialX: number;
  initialY: number;
  initialRotate: number;
  replacedBy: string;
}

const toolItems: ToolItem[] = [
  { id: 'notes', name: 'Notes App', initialX: -160, initialY: -100, initialRotate: -14, replacedBy: 'AI Notes Summarizer' },
  { id: 'quiz', name: 'Quiz Generator', initialX: 180, initialY: -80, initialRotate: 16, replacedBy: 'Live Quiz System' },
  { id: 'drive', name: 'Google Drive', initialX: -220, initialY: 20, initialRotate: -8, replacedBy: 'Resource Hub' },
  { id: 'resume', name: 'Resume Builder', initialX: 200, initialY: 40, initialRotate: 12, replacedBy: 'AI Resume Analyzer' },
  { id: 'placement', name: 'Placement Portal', initialX: -140, initialY: 120, initialRotate: -18, replacedBy: 'Career Hub' },
  { id: 'linkedin', name: 'LinkedIn / Networking', initialX: 150, initialY: 140, initialRotate: 10, replacedBy: 'Alumni Connect' },
  { id: 'planner', name: 'Planner / Calendar', initialX: -40, initialY: -150, initialRotate: 6, replacedBy: 'Study Planner' },
];

export const RealityCheck: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to transitions
  // We want the items to align between 20% and 55% of the scroll timeline
  const animationRange = [0.25, 0.6];

  return (
    <section
      ref={containerRef}
      id="reality-check"
      className="relative py-24 md:py-36 px-6 overflow-hidden bg-paper border-t border-border/60 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Headline and minimal copy */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10 lg:sticky lg:top-28">
            <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4">
              01 — THE PROBLEM
            </span>
            <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] md:text-[52px] leading-[1.08] tracking-tight mb-6">
              Students don't have a learning problem.<br />
              They have a tool problem.
            </h2>
            <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed max-w-md">
              Seven open tabs. Fragmented accounts. Lost files. The modern student lives in continuous coordination chaos, losing hours managing tools instead of mastering topics.
            </p>
            <div className="mt-8 flex items-center gap-4 font-mono text-[11px] text-graphite uppercase tracking-wider">
              <span>Scroll to organize</span>
              <span className="animate-bounce">↓</span>
            </div>
          </div>

          {/* Right Column: Visual Desk Space resolving into a Ledger */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[500px] md:min-h-[600px] w-full">
            {/* Outline box representing the ultimate unified Ledger */}
            <div className="w-full max-w-lg border border-border bg-paper/50 rounded-[8px] p-6 relative flex flex-col min-h-[420px] justify-between z-0">
              
              {/* Ledger top border UI */}
              <div className="flex items-center justify-between border-b border-border pb-3 mb-6 font-mono text-[11px] text-graphite uppercase">
                <span className="font-bold text-ink">StudySphere OS</span>
                <span>Unified Academic Record</span>
              </div>

              {/* Central Wordmark Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none dark:opacity-[0.05]">
                <span className="font-display font-extrabold text-7xl md:text-8xl text-ink">STUDY</span>
              </div>

              {/* The stack itself */}
              <div className="relative flex-1 flex flex-col justify-center gap-2.5">
                {toolItems.map((item, index) => {
                  // Framer motion hooks inside map
                  const initialXVal = prefersReducedMotion ? 0 : item.initialX;
                  const initialYVal = prefersReducedMotion ? 0 : item.initialY;
                  const initialRotVal = prefersReducedMotion ? 0 : item.initialRotate;

                  const x = useTransform(scrollYProgress, animationRange, [initialXVal, 0]);
                  const y = useTransform(scrollYProgress, animationRange, [initialYVal, 0]);
                  const rotate = useTransform(scrollYProgress, animationRange, [initialRotVal, 0]);
                  const scale = useTransform(scrollYProgress, animationRange, [1.02, 1]);
                  const shadowOpacity = useTransform(scrollYProgress, animationRange, [0.08, 0]);

                  return (
                    <motion.div
                      key={item.id}
                      style={{
                        x,
                        y,
                        rotate,
                        scale,
                        boxShadow: prefersReducedMotion 
                          ? 'none' 
                          : `0 4px 12px rgba(18, 21, 28, ${shadowOpacity.get()})`,
                      }}
                      className="w-full bg-paper border border-border rounded-[6px] px-4 py-3 flex items-center justify-between font-mono text-[13px] leading-none transition-colors duration-200 z-10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-graphite/40">0{index + 1}</span>
                        <span className="text-ink font-semibold">{item.name}</span>
                      </div>
                      
                      {/* Transformation indicator: Resolves into StudySphere module */}
                      <motion.div 
                        style={{
                          opacity: useTransform(scrollYProgress, animationRange, [0, 1])
                        }}
                        className="text-[11px] text-quad font-bold flex items-center gap-1"
                      >
                        <span className="text-graphite font-normal mr-1">→</span>
                        {item.replacedBy}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Ledger footer UI */}
              <div className="flex items-center justify-between border-t border-border pt-3 mt-6 font-mono text-[11px] text-graphite uppercase">
                <span>Verification</span>
                <span>Active and Consolidated</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
