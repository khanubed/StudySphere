import React from 'react';

interface FacultyRow {
  code: string;
  capability: string;
  description: string;
  status: string;
}

const capabilities: FacultyRow[] = [
  { code: 'FAC-101', capability: 'Resource Upload', description: 'Distribute class notes, syllabus details, and reading material automatically to targeted cohorts.', status: 'VERIFIED ACTIVE' },
  { code: 'FAC-102', capability: 'Instant Quiz Creation', description: 'Construct practice exams and homework modules from uploaded lectures with customizable difficulty ranges.', status: 'VERIFIED ACTIVE' },
  { code: 'FAC-103', capability: 'Unified Announcements', description: 'Broadcast urgent syllabus updates, schedule shifts, or assignment notices directly to student streams.', status: 'VERIFIED ACTIVE' },
  { code: 'FAC-104', capability: 'Class Cohort Analytics', description: 'Monitor attendance distributions, test averages, and weak subject clusters to adapt lectures in real time.', status: 'VERIFIED ACTIVE' },
];

export const FacultySection: React.FC = () => {
  return (
    <section id="faculty" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
            08 — FACULTY PORTAL
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            Built for students. Useful for faculty.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            One interface that handles class-wide material distribution, evaluation prep, and student performance tracking. No complex learning management software setups required.
          </p>
        </div>

        {/* Ledger Table style for Faculty Capabilities */}
        <div className="w-full border border-border bg-paper rounded-[8px] overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Header Row */}
              <thead>
                <tr className="border-b border-border bg-secondary/20 font-mono text-[11px] text-graphite tracking-wider uppercase select-none">
                  <th className="py-4 px-6 font-medium w-[15%]">Module Code</th>
                  <th className="py-4 px-6 font-medium w-[25%]">Faculty Module</th>
                  <th className="py-4 px-6 font-medium w-[45%]">Operational Workflow</th>
                  <th className="py-4 px-6 font-medium w-[15%] text-right">System Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border/40 font-mono text-[13px] text-ink">
                {capabilities.map((item) => (
                  <tr 
                    key={item.code} 
                    className="hover:bg-secondary/10 transition-colors duration-150 group"
                  >
                    {/* Code */}
                    <td className="py-4 px-6 text-quad font-bold">
                      {item.code}
                    </td>
                    
                    {/* Capability - Geist Font */}
                    <td className="py-4 px-6 font-sans font-semibold text-ink text-[14px]">
                      {item.capability}
                    </td>
                    
                    {/* Description - Inter Font */}
                    <td className="py-4 px-6 font-sans text-graphite text-[13px] leading-relaxed">
                      {item.description}
                    </td>
                    
                    {/* System Status */}
                    <td className="py-4 px-6 text-right tabular-nums text-quad font-bold text-[11px]">
                      <span className="inline-block bg-quad/5 px-2 py-1 rounded-[4px] border border-quad/20">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Table Footer / Footnote */}
          <div className="border-t border-border bg-secondary/10 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-graphite">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-quad rounded-full" />
              <span>Compliant with standard university registrar systems</span>
            </div>
            <span>Faculty Integration: Active</span>
          </div>

        </div>

      </div>
    </section>
  );
};
