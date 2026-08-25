import React from 'react';

interface ResourceRow {
  code: string;
  course: string;
  files: number;
  downloads: number;
  rating: string;
  contributors: number;
}

const resources: ResourceRow[] = [
  { code: 'CS-301', course: 'Database Management Systems', files: 142, downloads: 4120, rating: '4.9', contributors: 18 },
  { code: 'CS-302', course: 'Operating Systems', files: 89, downloads: 3890, rating: '4.8', contributors: 12 },
  { code: 'CS-303', course: 'Computer Networks', files: 215, downloads: 6102, rating: '4.7', contributors: 24 },
  { code: 'CS-304', course: 'Data Structures & Algorithms', files: 310, downloads: 12840, rating: '4.9', contributors: 42 },
];

export const ResourceHubShowcase: React.FC = () => {
  return (
    <section id="resources" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
            03 — RESOURCE CATALOG
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            Crowdsourced. Verified in 48h.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            Access study guides, previous year questions, and notes compiled by top students, each peer-vetted and stamped for accuracy.
          </p>
        </div>

        {/* Ledger Table Container */}
        <div className="w-full border border-border bg-paper rounded-[8px] overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              
              {/* Header Row */}
              <thead>
                <tr className="border-b border-border bg-secondary/20 font-mono text-[11px] text-graphite tracking-wider uppercase select-none">
                  <th className="py-4 px-6 font-medium w-[12%]">Course Code</th>
                  <th className="py-4 px-6 font-medium w-[30%]">Course Name</th>
                  <th className="py-4 px-6 font-medium w-[12%] text-right">Files</th>
                  <th className="py-4 px-6 font-medium w-[15%] text-right">Downloads</th>
                  <th className="py-4 px-6 font-medium w-[10%] text-right">Rating</th>
                  <th className="py-4 px-6 font-medium w-[13%] text-right">Contributors</th>
                  <th className="py-4 px-6 font-medium w-[8%] text-center">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border/40 font-mono text-[13px] text-ink">
                {resources.map((item) => (
                  <tr 
                    key={item.code} 
                    className="hover:bg-secondary/10 transition-colors duration-150 group"
                  >
                    {/* Code */}
                    <td className="py-4 px-6 text-quad font-bold">
                      {item.code}
                    </td>
                    
                    {/* Course Name - Geist UI Font */}
                    <td className="py-4 px-6 font-sans font-semibold text-ink text-[14px]">
                      {item.course}
                    </td>
                    
                    {/* Files count */}
                    <td className="py-4 px-6 text-right tabular-nums text-graphite">
                      {item.files} files
                    </td>
                    
                    {/* Downloads */}
                    <td className="py-4 px-6 text-right tabular-nums font-semibold">
                      {item.downloads.toLocaleString()}
                    </td>
                    
                    {/* Rating */}
                    <td className="py-4 px-6 text-right tabular-nums">
                      <span className="text-ink font-bold">{item.rating}</span>
                      <span className="text-graphite/50 text-[11px]">/5.0</span>
                    </td>
                    
                    {/* Contributors */}
                    <td className="py-4 px-6 text-right text-graphite">
                      {item.contributors} peers
                    </td>
                    
                    {/* Verification Stamp */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <div 
                          className="stamp-mark" 
                          title="Verified by Peer Review Committee"
                          aria-label="Verified Stamp"
                        />
                      </div>
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
              <span>Catalog size: 12,400+ entries across 12 departments</span>
            </div>
            <span>Auto-moderator: active (stamps updated hourly)</span>
          </div>

        </div>

      </div>
    </section>
  );
};
