import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface LedgerItem {
  label: string;
  targetValue: number;
  suffix: string;
}

const initialLedgerData: LedgerItem[] = [
  { label: 'AI NOTES SUMMARIZER', targetValue: 2341, suffix: 'pages condensed today' },
  { label: 'LIVE QUIZ', targetValue: 812, suffix: 'students in session' },
  { label: 'STUDY PLANNER', targetValue: 1204, suffix: 'revision plans generated' },
  { label: 'RESOURCE HUB', targetValue: 96, suffix: 'uploads verified in 48h' },
];

const LedgerRowComponent: React.FC<{ item: LedgerItem; triggerCycle: boolean }> = ({ item, triggerCycle }) => {
  const prefersReducedMotion = useReducedMotion();
  const [currentValue, setCurrentValue] = useState(prefersReducedMotion ? item.targetValue : 0);
  const [typedChars, setTypedChars] = useState('');

  // 1. Type-in and Count-up animation on load
  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentValue(item.targetValue);
      setTypedChars(item.label);
      return;
    }

    // Type-in animation for label
    let charIndex = 0;
    const labelInterval = setInterval(() => {
      if (charIndex <= item.label.length) {
        setTypedChars(item.label.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(labelInterval);
      }
    }, 25);

    // Count-up animation for value (starts slightly after label starts typing)
    const delayTimeout = setTimeout(() => {
      let startValue = 0;
      const duration = 1200; // ms
      const startTime = performance.now();

      const updateCount = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const ease = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(startValue + (item.targetValue - startValue) * ease);
        setCurrentValue(current);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCurrentValue(item.targetValue);
        }
      };

      requestAnimationFrame(updateCount);
    }, 150);

    return () => {
      clearInterval(labelInterval);
      clearTimeout(delayTimeout);
    };
  }, [item.label, item.targetValue, prefersReducedMotion]);

  // 2. Idle-cycle increment animation
  useEffect(() => {
    if (prefersReducedMotion || currentValue === 0) return;

    // Triggered periodically by the parent container
    if (triggerCycle) {
      const increment = Math.floor(Math.random() * 3) + 1;
      const baseValue = currentValue;
      const targetVal = baseValue + increment;
      const startTime = performance.now();
      const duration = 500;

      const updateIdle = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - (1 - progress) * (1 - progress);
        const val = Math.floor(baseValue + (targetVal - baseValue) * ease);
        setCurrentValue(val);

        if (progress < 1) {
          requestAnimationFrame(updateIdle);
        } else {
          setCurrentValue(targetVal);
        }
      };
      requestAnimationFrame(updateIdle);
    }
  }, [triggerCycle, prefersReducedMotion]);

  return (
    <div className="py-4 border-b border-border/40 last:border-b-0 flex items-center justify-between font-mono text-[13px] md:text-[14px] leading-none tracking-wide text-ink">
      <div className="flex-1 pr-4 truncate">
        {/* Cursor indicator shown while typing */}
        <span className="text-quad font-semibold select-none mr-2">✓</span>
        <span className="text-ink/80">{typedChars}</span>
        {typedChars.length < item.label.length && !prefersReducedMotion && (
          <span className="inline-block w-1.5 h-3.5 bg-quad animate-pulse ml-0.5" />
        )}
      </div>
      <div className="flex items-center gap-3 text-right flex-shrink-0">
        <span className="font-bold text-ink tabular-nums text-sm md:text-base">
          {currentValue.toLocaleString()}
        </span>
        <span className="text-graphite text-[11px] md:text-[12px] lowercase">
          {item.suffix}
        </span>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [cycleIndex, setCycleIndex] = useState(-1);
  const [cycleTrigger, setCycleTrigger] = useState(false);

  // Periodically select a random row to update its numbers
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * initialLedgerData.length);
      setCycleIndex(idx);
      setCycleTrigger(prev => !prev);
    }, 4500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section id="hero" className="relative pt-16 pb-24 md:pt-24 md:pb-36 px-6 overflow-hidden bg-paper transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Asymmetric, Left-Anchored Brand Stack */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            <span className="font-mono text-xs font-semibold text-quad tracking-[0.15em] uppercase mb-4">
              STY — ACADEMIC OS
            </span>
            
            <h1 className="font-display text-ink font-bold text-[44px] sm:text-[56px] md:text-[72px] lg:text-[76px] xl:text-[84px] leading-[1.02] tracking-tight mb-6 max-w-xl">
              Stop juggling 10 apps just to survive college.
            </h1>
            
            <p className="font-body text-[17px] md:text-[18px] text-graphite leading-relaxed mb-8 max-w-lg">
              Notes, quizzes, study plans, resume building, placement prep, and alumni mentorship. 
              StudySphere merges your scattered academic stack into one running ledger.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto">
              <Link
                to="/register"
                className="bg-quad text-paper hover:opacity-95 text-center font-sans text-[15px] font-semibold px-8 py-3.5 rounded-[6px] transition-all duration-200"
              >
                Start free
              </Link>
              
              <a
                href="#reality-check"
                className="font-sans text-[15px] font-semibold text-ink hover:text-quad flex items-center justify-center gap-1.5 transition-colors group py-2"
              >
                Explore the platform
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Signature Ledger Panel (Bleeds slightly past edge) */}
          <div className="lg:col-span-6 relative w-full lg:w-[108%] lg:-mr-[8%] xl:w-[112%] xl:-mr-[12%]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="border border-border/80 bg-paper rounded-[8px] p-6 md:p-8 relative shadow-none"
            >
              {/* Ledger Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4 font-mono text-[11px] text-graphite tracking-wider uppercase">
                <div className="flex items-center gap-3">
                  <span>ACADEMIC LEDGER v1.0</span>
                  <span className="w-1.5 h-1.5 bg-quad rounded-full animate-pulse" />
                </div>
                <span>LIVE FEED</span>
              </div>

              {/* Ledger Rows */}
              <div className="flex flex-col">
                {initialLedgerData.map((item, idx) => (
                  <LedgerRowComponent
                    key={item.label}
                    item={item}
                    triggerCycle={cycleIndex === idx ? cycleTrigger : false}
                  />
                ))}
              </div>

              {/* Ledger Footer */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-[11px] text-graphite">
                <span>FEED STATUS: STREAMING</span>
                <span>SYSTEM ACTIVE</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};