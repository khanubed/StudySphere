import React from 'react';
import { Link } from 'react-router-dom';

const links = {
  product: [
    { label: 'Academic OS', href: '#hero' },
    { label: 'Resource Catalog', href: '#resources' },
    { label: 'AI Features', href: '#ai-features' },
    { label: 'Pricing Plan', href: '#pricing' },
  ],
  network: [
    { label: 'Recruiter Hub', href: '#career' },
    { label: 'Alumni Registry', href: '#alumni' },
    { label: 'Faculty Login', href: '#faculty' },
  ],
  legal: [
    { label: 'Privacy Registry', href: '/privacy' },
    { label: 'Terms of Study', href: '/terms' },
    { label: 'Data Policy', href: '/data' },
  ]
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-paper border-t border-border/60 pt-16 pb-8 px-6 transition-colors duration-200" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & Vision Block */}
          <div className="col-span-2 md:col-span-1 text-left">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="StudySphere Home">
              <svg className="w-5 h-5 text-quad" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="font-display font-bold text-ink text-[18px] tracking-tight">StudySphere</span>
            </Link>
            <p className="font-body text-[13px] text-graphite leading-relaxed max-w-xs">
              Consolidating scattered academic tools into a single running ledger. Built for students, verified by peers.
            </p>
          </div>

          {/* Nav Column 1 */}
          <div className="text-left font-mono">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-4">SYSTEM INDEX</span>
            <ul className="space-y-2.5 text-[12px] text-graphite">
              {links.product.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-ink transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="text-left font-mono">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-4">ALUMNI & ROLES</span>
            <ul className="space-y-2.5 text-[12px] text-graphite">
              {links.network.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-ink transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div className="text-left font-mono">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-4">COMPLIANCE</span>
            <ul className="space-y-2.5 text-[12px] text-graphite">
              {links.legal.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="hover:text-ink transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Hairline Divided Copyright footer bar */}
        <div className="border-t border-border/40 pt-8 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-graphite">
          <div>
            <span>© {new Date().getFullYear()} STUDYSPHERE CO. RECORD ID: #983-021.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>PLATFORM BUILD: v1.0.4-PROD</span>
            <span className="w-1.5 h-1.5 bg-quad rounded-full" />
            <span>ALL SYSTEMS ACTIVE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};