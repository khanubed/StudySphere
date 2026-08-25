import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface MetricRow {
  code: string;
  label: string;
  value: string;
  detail: string;
}

const metrics: MetricRow[] = [
  { code: 'MET-01', label: 'Student Activation', value: '68%', detail: 'Complete profile + use one AI tool within 7 days' },
  { code: 'MET-02', label: 'Resources Uploaded', value: '12,400+', detail: 'Weekly uploads across all institutions' },
  { code: 'MET-03', label: 'Verification Rate', value: '94%', detail: 'Resources verified within 48 hours' },
  { code: 'MET-04', label: 'AI Completions', value: '2.3M', detail: 'Total generations across all AI modules' },
  { code: 'MET-05', label: 'Faculty Adoption', value: '312', detail: 'Active faculty using Faculty Portal' },
  { code: 'MET-06', label: 'Alumni Connections', value: '8,900+', detail: 'Mentorship requests accepted' },
  { code: 'MET-07', label: 'Study Streaks', value: '47 days', detail: 'Median active streak length' },
  { code: 'MET-08', label: 'Free-to-Paid', value: '12.4%', detail: 'Conversion rate at 90 days' },
];

export const Metrics: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="metrics" className="py-20 md:py-28 px-6 bg-ink">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <span className="font-mono text-xs text-graphite uppercase tracking-widest block mb-4">
            TRANSCRIPT FOOTNOTES
          </span>
          <h2 className="font-display font-extrabold text-paper leading-[1.05] tracking-tight text-4xl md:text-5xl lg:text-6xl max-w-3xl">
            The numbers on the ledger.
          </h2>
        </motion.div>

        <div className="space-y-0" role="list" aria-label="Platform metrics">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.code}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-5 border-b border-graphite/15 last:border-b-0 relative"
              role="listitem"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-[200px] flex-shrink-0">
                <span className="font-mono text-xs text-graphite uppercase tracking-wider text-right w-16 sm:w-20 select-none">
                  {metric.code}
                </span>
                <div className="border-l border-graphite/20 pl-4">
                  <span className="font-body text-sm text-paper/70 block">{metric.label}</span>
                  <span className="font-mono text-xs text-graphite uppercase tracking-wider">{metric.detail}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end flex-1 text-right sm:ml-auto">
                <span className="font-display font-bold text-paper text-2xl md:text-3xl lg:text-4xl tabular-nums" aria-live="polite">
                  {metric.value}
                </span>
              </div>

              <div 
                className="absolute bottom-0 left-0 w-0 h-[1px] bg-quad/30 group-hover:w-full transition-all duration-500"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-graphite/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-graphite uppercase tracking-wider">
              Data as of
            </span>
            <span className="font-mono text-xs text-quad font-medium" id="metrics-date">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-graphite uppercase tracking-wider">
              Source: Internal analytics
            </span>
            <span className="w-px h-4 bg-graphite/30" aria-hidden="true" />
            <span className="font-mono text-xs text-graphite uppercase tracking-wider">
              Not investor projections
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};