import React from 'react';

interface Pathway {
  role: string;
  count: string;
  employers: string;
}

const pathways: Pathway[] = [
  { role: 'SOFTWARE ENGINEER', count: '14 active mentors', employers: 'Stripe, Microsoft, Google' },
  { role: 'PRODUCT MANAGER', count: '06 active mentors', employers: 'Uber, Atlassian, Vercel' },
  { role: 'DATA ANALYST', count: '09 active mentors', employers: 'Meta, Snowflake, Netflix' },
];

export const AlumniNetwork: React.FC = () => {
  return (
    <section id="alumni" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
            07 — ALUMNI NETWORK
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            Understated structural pathways.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            Direct routing to college graduates who walked your exact academic path. Structured like a course-prerequisite tree, not a cluttered social timeline.
          </p>
        </div>

        {/* Branching Pathway Chart Container */}
        <div className="max-w-3xl mx-auto border border-border/80 bg-paper p-8 rounded-[8px] relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 transition-colors duration-200">
          
          {/* Root Node: Left Side */}
          <div className="flex-shrink-0 z-10 w-full md:w-auto">
            <div className="border border-quad bg-quad/5 rounded-[6px] px-6 py-4 flex flex-col items-center justify-center text-center font-mono w-full md:w-44 shadow-none">
              <span className="text-[10px] text-quad font-bold uppercase tracking-widest mb-1 select-none">ROOT NODE</span>
              <span className="font-bold text-ink text-[14px]">[ YOU ]</span>
              <span className="text-[10px] text-graphite mt-1">SEMESTER V</span>
            </div>
          </div>

          {/* Connectors Column (SVG paths on desktop, simple divider lines on mobile) */}
          <div className="hidden md:block flex-1 h-44 relative w-24">
            <svg className="absolute inset-0 w-full h-full text-border/80" fill="none" stroke="currentColor" strokeWidth="1.5" preserveAspectRatio="none">
              {/* Top Branch */}
              <path d="M 0 88 C 40 88, 40 28, 96 28" />
              {/* Center Branch */}
              <path d="M 0 88 L 96 88" />
              {/* Bottom Branch */}
              <path d="M 0 88 C 40 88, 40 148, 96 148" />
            </svg>
          </div>

          {/* Target Nodes: Right Side Stack */}
          <div className="flex-1 w-full md:w-auto space-y-4 z-10">
            {pathways.map((node) => (
              <div 
                key={node.role}
                className="border border-border/80 bg-paper rounded-[6px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono hover:border-quad/60 transition-colors duration-150 text-left"
              >
                <div>
                  {/* Role name */}
                  <span className="font-bold text-ink text-[13px] tracking-wide block">
                    {node.role}
                  </span>
                  
                  {/* Employers detail */}
                  <span className="text-graphite text-[11px] block mt-1">
                    {node.employers}
                  </span>
                </div>

                {/* Mentors count info */}
                <div className="text-right flex-shrink-0">
                  <span className="text-quad font-semibold text-[11px] uppercase tracking-wider bg-quad/5 px-2 py-1 rounded-[4px]">
                    {node.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
