import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface Module {
  code: string;
  title: string;
  description: string;
  category: 'core' | 'ai' | 'career' | 'social' | 'admin';
  phase: 1 | 2;
}

const modules: Module[] = [
  { code: 'STY-101', title: 'Dashboard', description: 'Your academic command center — metrics, streaks, and progress at a glance.', category: 'core', phase: 1 },
  { code: 'STY-102', title: 'Resource Hub', description: 'Upload, search, and organize notes, PYQs, and books with peer verification.', category: 'core', phase: 1 },
  { code: 'STY-103', title: 'AI Notes Summarizer', description: 'Turn PDFs, slides, and docs into summaries, flashcards, and mind maps in seconds.', category: 'ai', phase: 1 },
  { code: 'STY-104', title: 'AI Quiz Generator', description: 'Generate MCQs, fill-blanks, and short-answer quizzes from any material.', category: 'ai', phase: 1 },
  { code: 'STY-105', title: 'AI Assignment Helper', description: 'Grammar checks, citation formatting (APA/MLA/IEEE), and writing analysis.', category: 'ai', phase: 1 },
  { code: 'STY-106', title: 'Study Planner', description: 'AI-generated daily, weekly, and revision schedules that adapt to your pace.', category: 'core', phase: 1 },
  { code: 'STY-107', title: 'Live Quiz System', description: 'Real-time quiz sessions — join via code or QR, compete on live leaderboards.', category: 'core', phase: 1 },
  { code: 'STY-108', title: 'Faculty Portal', description: 'Upload resources, post announcements, create quizzes, track class analytics.', category: 'core', phase: 1 },
  { code: 'STY-109', title: 'Career Hub', description: 'Search and apply to internships and jobs with company profiles and deadlines.', category: 'career', phase: 1 },
  { code: 'STY-110', title: 'Alumni Connect', description: 'Browse alumni directory, request mentorship, message graduates in your field.', category: 'social', phase: 1 },
  { code: 'STY-111', title: 'AI Resume Analyzer', description: 'ATS scoring, keyword gap analysis, grammar review, and targeted suggestions.', category: 'ai', phase: 1 },
  { code: 'STY-112', title: 'Notification System', description: 'In-app, email, and push notifications — real-time, relevant, controllable.', category: 'core', phase: 1 },
  { code: 'STY-113', title: 'User Profile System', description: 'Academic profile, privacy controls, achievements, and contributor badges.', category: 'core', phase: 1 },
  { code: 'STY-114', title: 'Authentication System', description: 'Email/password and Google OAuth with JWT, refresh tokens, role assignment.', category: 'core', phase: 1 },
  { code: 'STY-115', title: 'Admin Panel', description: 'User management, content moderation, platform analytics, plan and token config.', category: 'admin', phase: 1 },
  { code: 'STY-201', title: 'Coding Hub', description: 'DSA, Web Dev, AI/ML tracks with curated sheets (A2Z, Blind75) and AI code review.', category: 'career', phase: 2 },
];

const categoryLabels: Record<Module['category'], string> = {
  core: 'CORE',
  ai: 'AI-POWERED',
  career: 'CAREER',
  social: 'NETWORK',
  admin: 'ADMIN',
};

const categoryColors: Record<Module['category'], string> = {
  core: 'quad',
  ai: 'chalk',
  career: 'marker',
  social: 'quad',
  admin: 'graphite',
};

function ModuleTile({ module, index }: { module: Module; index: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      style={{ perspective: 1000 }}
    >
      <div className="relative w-full h-64 md:h-72 transition-all duration-500 ease-out transform-style-3d" 
           style={{ transformStyle: 'preserve-3d' }}>
        
        <div className="absolute inset-0 backface-hidden bg-paper border border-graphite/20 rounded-lg p-6 flex flex-col overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <span className="font-mono text-xs text-graphite uppercase tracking-wider">{module.code}</span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded uppercase tracking-wider ${categoryColors[module.category] === 'quad' ? 'bg-quad/10 text-quad' : categoryColors[module.category] === 'chalk' ? 'bg-chalk/10 text-chalk' : categoryColors[module.category] === 'marker' ? 'bg-marker/10 text-marker' : 'bg-graphite/10 text-graphite'}`}>
              {categoryLabels[module.category]}
            </span>
          </div>
          
          <h3 className="font-display font-bold text-ink text-lg md:text-xl leading-snug mb-3 flex-1">
            {module.title}
          </h3>
          
          <p className="font-body text-sm text-graphite leading-relaxed flex-1">
            {module.description}
          </p>
          
          <div className="mt-4 pt-4 border-t border-graphite/10 flex items-center justify-between">
            <span className="font-mono text-xs text-graphite">
              Phase {module.phase}
            </span>
            <motion.div
              className="stamp-mark opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              whileHover={{ opacity: 1, scale: 1, rotate: 0 }}
            />
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden bg-ink rounded-lg p-6 flex flex-col justify-center items-center text-center transform rotate-y-180 hidden md:block"
             style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <span className="font-display font-bold text-paper text-2xl md:text-3xl mb-3">{module.title}</span>
          <p className="font-body text-paper/70 text-base leading-relaxed max-w-xs">{module.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="font-mono text-xs text-graphite uppercase tracking-wider">Phase {module.phase}</span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded uppercase tracking-wider ${categoryColors[module.category] === 'quad' ? 'bg-quad/20 text-quad' : categoryColors[module.category] === 'chalk' ? 'bg-chalk/20 text-chalk' : categoryColors[module.category] === 'marker' ? 'bg-marker/20 text-marker' : 'bg-graphite/20 text-graphite'}`}>
              {categoryLabels[module.category]}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const Modules: React.FC = () => {
  return (
    <section id="modules" className="py-20 md:py-28 lg:py-32 px-6 bg-paper">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-graphite uppercase tracking-widest block mb-4">
            MODULE CATALOG
          </span>
          <h2 className="font-display font-extrabold text-ink leading-[1.05] tracking-tight text-4xl md:text-5xl lg:text-6xl max-w-3xl">
            Sixteen modules. One academic OS.
          </h2>
          <p className="font-body text-lg text-graphite leading-relaxed mt-6 max-w-2xl">
            Every module maps to a real student workflow — not a feature list. Hover any tile to see the stamp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {modules.map((module, index) => (
            <ModuleTile key={module.code} module={module} index={index} />
          ))}
        </div>

        <div className="mt-16 flex items-center justify-start">
          <div className="flex items-center gap-4 border-t border-graphite/20 w-full max-w-md">
            <span className="font-mono text-xs text-graphite uppercase tracking-wider">
              {modules.filter(m => m.phase === 1).length} modules in v1
            </span>
            <span className="font-mono text-xs text-graphite uppercase tracking-wider text-marker">
              {modules.filter(m => m.phase === 2).length} in Phase 2
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};