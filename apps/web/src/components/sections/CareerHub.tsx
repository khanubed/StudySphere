import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface CareerStep {
  label: string;
}

interface Internship {
  company: string;
  role: string;
  location: string;
  stipend: string;
  duration: string;
  cohort: string;
}

const careerTimeline: CareerStep[] = [
  { label: 'Semester 1' },
  { label: 'Build Skills' },
  { label: 'Create Resume' },
  { label: 'Practice Interviews' },
  { label: 'Apply Internships' },
  { label: 'Get Hired' },
];

const internships: Internship[] = [
  { company: 'MICROSOFT RESEARCH', role: 'Machine Learning Research Intern', location: 'LOC: REDMOND, WA (HYBRID)', stipend: 'STIPEND: $8,500/MO', duration: 'TERM: 12 WEEKS', cohort: 'BATCH: SUMMER 2026' },
  { company: 'STRIPE CORPORATION', role: 'Backend Infrastructure Engineer Intern', location: 'LOC: REMOTE (US/CAN)', stipend: 'STIPEND: $9,200/MO', duration: 'TERM: 16 WEEKS', cohort: 'BATCH: FALL 2026' },
  { company: 'VERCEL LABS', role: 'Frontend Platform Engineer Intern', location: 'LOC: SAN FRANCISCO, CA', stipend: 'STIPEND: $8,000/MO', duration: 'TERM: 12 WEEKS', cohort: 'BATCH: SUMMER 2026' },
];

export const CareerHub: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="career" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
            06 — CAREER PLACEMENTS
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            From classroom to career.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            Consolidate your coursework and side projects directly into job matches. Bypass typical application platforms and stand out on our verified recruiter network.
          </p>
        </div>

        {/* Timeline Flow - Asymmetric Horizontal Timeline */}
        <div className="relative mb-20 pt-6 pb-6">
          <div className="absolute top-[28px] left-0 right-0 h-[1px] bg-border/60 hidden md:block" aria-hidden="true" />
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
            {careerTimeline.map((step, idx) => (
              <div 
                key={step.label}
                className="relative flex flex-col items-start cursor-default pt-2 group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Timeline node dots on desktop */}
                <div className="w-3.5 h-3.5 rounded-full border-2 border-border bg-paper z-10 transition-all duration-200 group-hover:border-quad group-hover:bg-quad mb-4 hidden md:block" />
                
                {/* Stage number & label */}
                <div className="font-mono text-[13px] font-semibold text-ink uppercase tracking-wider leading-none flex items-center gap-1.5">
                  <span className="text-quad font-bold">0{idx + 1}</span>
                  <span>{step.label}</span>
                </div>
                
                {/* Underlying underline draw-in */}
                <div className="w-full h-[1.5px] bg-border/20 relative mt-3 overflow-hidden">
                  <div className={`absolute bottom-0 left-0 top-0 bg-quad origin-left transition-transform duration-300 w-full ${
                    hoveredIdx === idx ? 'scale-x-100' : 'scale-x-0'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Internship Postings Grid (Modest 1px-border cards, mono company names, Inter role titles, no circles) */}
        <div className="grid md:grid-cols-3 gap-6">
          {internships.map((job) => (
            <div 
              key={job.company + job.role}
              className="border border-border/80 bg-paper rounded-[6px] p-6 hover:border-quad/60 hover:shadow-sm transition-all duration-200 flex flex-col justify-between text-left"
            >
              <div>
                {/* Company Name: Mono uppercase */}
                <span className="font-mono text-[11px] font-bold text-graphite tracking-widest block mb-3">
                  {job.company}
                </span>

                {/* Job Role Title: Inter */}
                <h3 className="font-sans font-semibold text-ink text-[16px] md:text-[18px] leading-snug mb-6">
                  {job.role}
                </h3>

                {/* Metadata Details: IBM Plex Mono */}
                <div className="space-y-2 border-t border-border/40 pt-4 font-mono text-[12px] text-graphite/90 leading-none">
                  <div>{job.location}</div>
                  <div>{job.stipend}</div>
                  <div>{job.duration}</div>
                  <div>{job.cohort}</div>
                </div>
              </div>

              {/* Apply CTA */}
              <div className="mt-8 pt-4 border-t border-border/30 flex items-center justify-between font-mono text-[11px]">
                <span className="text-quad font-semibold uppercase tracking-wider">RECRUITER ONLINE</span>
                <button className="text-ink hover:text-quad flex items-center gap-1 font-bold group">
                  Submit File
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
