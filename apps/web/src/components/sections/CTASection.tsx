import React from 'react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
  return (
    <section 
      id="cta-final" 
      className="relative py-24 md:py-36 px-6 overflow-hidden bg-paper border-t border-border/60 transition-colors duration-200"
    >
      {/* Subtle Monospace Repeating Grid Pattern background at low opacity */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(138,141,133,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(138,141,133,0.1)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40 dark:opacity-20" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Asymmetric, Left-aligned block */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-6">
              11 — ADMISSION OPEN
            </span>
            
            {/* 3-line Fraunces headline */}
            <h2 className="font-display text-ink font-bold text-[36px] sm:text-[48px] md:text-[60px] leading-[1.08] tracking-tight mb-8">
              One platform for learning.<br />
              One platform for growth.<br />
              One platform for your future.
            </h2>
            
            {/* Buttons stack */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="bg-quad text-paper hover:opacity-95 text-center font-sans text-[15px] font-semibold px-8 py-3.5 rounded-[6px] transition-colors duration-200"
              >
                Start free
              </Link>
              
              <Link
                to="/contact"
                className="border border-border bg-paper hover:border-quad text-ink hover:text-quad text-center font-sans text-[15px] font-semibold px-8 py-3.5 rounded-[6px] transition-colors duration-200"
              >
                Request demo
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};