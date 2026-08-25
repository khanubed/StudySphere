import React from 'react';

interface MetricDetail {
  id: string;
  metric: string;
  value: string;
  scale: string;
  status: string;
  needsAttention?: boolean;
}

const metrics: MetricDetail[] = [
  { id: 'GPA', metric: 'Cumulative GPA', value: '9.12', scale: '/ 10.0', status: 'First Class with Distinction' },
  { id: 'ATT', metric: 'Overall Attendance', value: '94.2%', scale: '(Min: 75%)', status: 'Compliant' },
  { id: 'GOAL', metric: 'Weekly Study Target', value: '14.5h', scale: '/ 20h', status: '72% achieved' },
  { id: 'REV', metric: 'Revision Streaks', value: '06', scale: 'active topics', status: 'On Track' },
  { id: 'DDL', metric: 'Pending Assignments', value: '02', scale: 'due in 48h', status: 'DBMS Lab, OS PYQ' },
  { id: 'CAR', metric: 'Placement Readiness Index', value: '72%', scale: 'ATS threshold: 85%', status: 'ATS review recommended', needsAttention: true },
];

export const DashboardPreview: React.FC = () => {
  return (
    <section id="dashboard-preview" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5 text-left">
            <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
              05 — ACADEMIC DASHBOARD
            </span>
            <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
              Your transcript is the dashboard.
            </h2>
            <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
              No bloated widget configurations. StudySphere consolidates attendance, academic records, and career benchmarks into a single clean report card.
            </p>
          </div>
        </div>

        {/* Transcript / Report Card Styled Panel */}
        <div className="max-w-3xl mx-auto border-double border-4 border-border bg-paper p-6 sm:p-8 rounded-[8px] transition-colors duration-200 relative">
          
          {/* Transcript Header */}
          <div className="border-b border-border/60 pb-6 mb-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[11px] text-graphite uppercase">
              <div>
                <span className="text-ink font-bold block text-sm">STUDYSPHERE UNIVERSITY SYSTEM</span>
                <span>REGISTRAR RECORD: OFFICIAL TRANSCRIPT</span>
              </div>
              <div className="text-right">
                <span>TERM: SEMESTER V</span>
                <span className="block">GEN DATE: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Transcript Table Rows */}
          <div className="space-y-1" role="list" aria-label="Student transcript metrics">
            {metrics.map((row) => (
              <div 
                key={row.id}
                role="listitem"
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-border/30 last:border-0 relative font-mono text-[13px] leading-none transition-all duration-150 ${
                  row.needsAttention 
                    ? 'border-l-4 border-quad bg-quad/5 pl-4 pr-2 py-3 rounded-[4px] my-1' 
                    : ''
                }`}
              >
                {/* Metric Title & ID */}
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <span className="text-graphite font-bold select-none text-[11px] tracking-wider">{row.id}</span>
                  <span className="text-ink font-semibold">{row.metric}</span>
                </div>

                {/* Metric Value & Detail */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-right">
                  <div className="text-left sm:text-right">
                    <span className="font-bold text-ink tabular-nums text-sm md:text-base">{row.value}</span>
                    <span className="text-graphite/60 text-[11px] ml-1">{row.scale}</span>
                  </div>
                  
                  <span className={`text-[11px] uppercase tracking-wider ${
                    row.needsAttention ? 'text-quad font-bold' : 'text-graphite'
                  }`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Transcript Seal / Footer */}
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[11px] text-graphite">
            <span>OFFICIAL RECORD • NON-TRANSFERABLE</span>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border border-quad rounded-full flex items-center justify-center text-[10px] text-quad font-bold">✓</span>
              <span>VERIFIED BY registrar@studysphere.edu</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
