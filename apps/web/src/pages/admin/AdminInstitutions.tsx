import React from 'react';
import { School, Plus, CheckCircle2 } from 'lucide-react';

export const AdminInstitutions: React.FC = () => {
  const campuses = [
    {
      id: 'inst-1',
      name: 'Apex Institute of Technology',
      domain: 'apex.edu',
      studentsCount: 3400,
      verified: true,
    },
    {
      id: 'inst-2',
      name: 'National University of Engineering',
      domain: 'nue.ac.in',
      studentsCount: 6200,
      verified: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">University & Campus Config</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure branches, semesters, verified email domains, and institutional quotas.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Campus Domain
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {campuses.map((inst) => (
          <div key={inst.id} className="p-6 rounded-2xl border border-border bg-card space-y-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            <h3 className="font-bold text-lg">{inst.name}</h3>
            <p className="text-xs text-muted-foreground">Domain: @{inst.domain}</p>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Enrolled Students</span>
              <span className="font-bold text-foreground">{inst.studentsCount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
