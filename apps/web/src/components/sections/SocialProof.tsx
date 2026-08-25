import React from 'react';

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { value: '20,000+', label: 'RESOURCES SHARED' },
  { value: '50,000+', label: 'AI LEARNING SESSIONS' },
  { value: '5,000+', label: 'STUDENTS HELPED' },
  { value: '300+', label: 'MENTORS AVAILABLE' },
];

export const SocialProof: React.FC = () => {
  return (
    <section id="social-proof" className="py-12 bg-paper border-t border-b border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Footnotes Row Layout */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 font-mono text-[11px] text-graphite">
          
          {/* Header Marker */}
          <div className="flex-shrink-0 flex items-center gap-2 select-none uppercase font-bold text-ink">
            <span className="w-1.5 h-1.5 bg-quad rounded-full" />
            <span>PLATFORM FOOTNOTES [METRICS]</span>
          </div>

          {/* Stats List: Single Hairline Divided Grid/Flex Row */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-border/60 gap-6 sm:gap-0 flex-1 justify-around">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="w-full sm:w-auto text-left sm:px-8 first:pl-0 last:pr-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/40"
              >
                {/* Large Mono Number */}
                <div className="font-mono text-2xl md:text-3xl font-bold text-ink tracking-tight leading-none">
                  {stat.value}
                </div>
                
                {/* Small-caps description in Inter font */}
                <div className="font-sans text-[10px] md:text-[11px] font-semibold text-graphite uppercase tracking-widest mt-2 leading-none">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
