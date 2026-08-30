import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTokenUsageQuery } from '../store/api/aiApi';
import {
  Sparkles,
  Brain,
  FileCheck,
  FileSearch,
  Calendar,
  Code,
  ArrowRight,
  Coins,
  History,
  CheckCircle2,
} from 'lucide-react';


interface AIToolCard {
  id: string;
  title: string;
  category: 'Study & Synthesis' | 'Assessment' | 'Writing & Career' | 'Coding';
  route: string;
  tokenCost: string;
  tag: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  ctaLabel: string;
  accentColor: string;
}

export const AIToolsHub: React.FC = () => {
  const navigate = useNavigate();
  const { data: tokenUsageResponse } = useGetTokenUsageQuery();
  const tokenUsage = tokenUsageResponse?.data || { used: 120, limit: 1000 };

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tools: AIToolCard[] = [
    {
      id: 'summarizer',
      title: 'AI Notes & Study Kit Summarizer',
      category: 'Study & Synthesis',
      route: '/ai/summarizer',
      tokenCost: '10–25 Credits',
      tag: 'Most Popular',
      icon: Sparkles,
      description:
        'Transform heavy academic PDFs, PPTXs, or lecture transcripts into multi-format study kits with structured notes, LaTeX formula sheets, and interactive 3D flashcards.',
      features: [
        'Executive & detailed conceptual summaries',
        '3D interactive flashcards with mastery tracking',
        'LaTeX formula sheets & viva examination questions',
        'Visual SVG mind map concept hierarchy',
      ],
      ctaLabel: 'Launch Study Kit Desk',
      accentColor: 'border-chalk/40 bg-chalk/5 text-chalk',
    },
    {
      id: 'quiz',
      title: 'AI Quiz Generator & Exam Simulator',
      category: 'Assessment',
      route: '/ai/quiz/new',
      tokenCost: '14–30 Credits',
      tag: 'Anti-Tamper Hall',
      icon: Brain,
      description:
        'Generate rigorous collegiate quizzes from lecture notes or syllabus topics with a server countdown timer and automated weak-topic diagnostic ledgers.',
      features: [
        'Supports MCQ, Fill-in-the-Blanks & Proofs',
        'Server-authoritative anti-distraction countdown clock',
        'Honors scorecard with cohort percentile ranking',
        'Granular weak-area syllabus mastery diagnostics',
      ],
      ctaLabel: 'Generate Assessment',
      accentColor: 'border-quad/40 bg-quad/5 text-quad',
    },
    {
      id: 'assignment',
      title: 'AI Assignment Helper & Citation Auditor',
      category: 'Writing & Career',
      route: '/ai/assignment-helper',
      tokenCost: '10 Credits',
      tag: 'Peer Review',
      icon: FileCheck,
      description:
        'Audit research papers and technical assignment drafts for academic tone, clarity, grammar accuracy, and proper citation formatting.',
      features: [
        'Scholarly tone and readability scoring',
        'APA, MLA, and IEEE citation verification',
        'Plagiarism risk highlighting & rewrites',
        'Line-by-line acceptance/rejection controls',
      ],
      ctaLabel: 'Audit Assignment',
      accentColor: 'border-marker/40 bg-marker/5 text-ink',
    },
    {
      id: 'resume',
      title: 'AI Resume & ATS Compatibility Analyzer',
      category: 'Writing & Career',
      route: '/ai/resume-analyzer',
      tokenCost: '10 Credits',
      tag: 'Placement Ready',
      icon: FileSearch,
      description:
        'Compare your technical resume against target internship or software engineering job descriptions to calculate ATS match scores and identify missing keywords.',
      features: [
        'ATS algorithm compatibility score %',
        'Missing technical skills and keyword gap auditor',
        'Action-oriented bullet point rewrites',
        'Targeted job description alignment',
      ],
      ctaLabel: 'Analyze Resume',
      accentColor: 'border-chalk/40 bg-chalk/5 text-chalk',
    },
    {
      id: 'planner',
      title: 'AI Study Schedule & Revision Planner',
      category: 'Study & Synthesis',
      route: '/planner',
      tokenCost: '5 Credits',
      tag: 'Exam Pacing',
      icon: Calendar,
      description:
        'Synthesize dynamic, stress-free daily revision schedules tailored to upcoming university exam dates, subject credits, and daily available study hours.',
      features: [
        'Automated syllabus topic spacing',
        'Daily Pomodoro revision block allocation',
        'Exam countdowns & milestones tracker',
        'Adaptive rescheduling when plans slip',
      ],
      ctaLabel: 'Create Study Plan',
      accentColor: 'border-quad/40 bg-quad/5 text-quad',
    },
    {
      id: 'coding',
      title: 'AI Code Mentor & Complexity Analyzer',
      category: 'Coding',
      route: '/coding',
      tokenCost: '5 Credits',
      tag: 'Algorithms',
      icon: Code,
      description:
        'Debug algorithmic code, analyze asymptotic time/space complexities, and receive step-by-step optimization hints across 10+ programming languages.',
      features: [
        'Big-O asymptotic runtime & space evaluation',
        'Edge case and boundary vulnerability checks',
        'Multi-language translation (C++, Java, Python, Rust)',
        'LeetCode problem breakdown & hints',
      ],
      ctaLabel: 'Open Coding Workspace',
      accentColor: 'border-chalk/40 bg-chalk/5 text-chalk',
    },
  ];

  const categories = ['All', 'Study & Synthesis', 'Assessment', 'Writing & Career', 'Coding'];

  const filteredTools = tools.filter((t) => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1380px] mx-auto pb-12">
      
      {/* ── 1. ACADEMIC OS LEDGER HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-chalk/10 text-chalk border border-chalk/30">
              ACADEMIC OS STUDIO
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite uppercase">
              AI TOOLS CATALOG
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            Academic AI Tools Catalog
          </h1>
          <p className="font-sans text-xs text-graphite mt-0.5">
            Select a specialized AI research desk, assessment engine, or academic analyzer to accelerate your studies.
          </p>
        </div>

        {/* Token Balance & History Link */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-md border border-chalk/40 bg-chalk/10 flex items-center gap-2">
            <Coins className="w-4 h-4 text-chalk" />
            <div className="font-mono text-xs">
              <span className="font-bold text-ink">{tokenUsage.limit - tokenUsage.used}</span>
              <span className="text-graphite"> / {tokenUsage.limit} Tokens</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai/quiz/history')}
            className="px-3 py-1.5 rounded-md border border-border bg-paper hover:bg-secondary/40 font-mono text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-graphite" />
            <span>Assessment Logs</span>
          </button>
        </div>
      </div>

      {/* ── 2. FILTER TABS & SEARCH BAR ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-[4px] font-mono text-xs font-bold transition-all shrink-0 border ${
                activeCategory === cat
                  ? 'border-chalk bg-chalk text-white shadow-xs'
                  : 'border-border bg-paper text-graphite hover:text-ink hover:bg-secondary/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI capabilities..."
            className="w-full pl-3 pr-3 py-1.5 text-xs rounded border border-border bg-secondary/10 text-ink focus:outline-none focus:border-chalk"
          />
        </div>
      </div>

      {/* ── 3. AI TOOLS GRID (2x3 or 3x2) ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;

          return (
            <div
              key={tool.id}
              className="p-5 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs flex flex-col justify-between hover:border-chalk/60 transition-all group"
            >
              <div className="space-y-3">
                {/* Card Top: Icon & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2.5 rounded-md border ${tool.accentColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-secondary/30 text-graphite border border-border">
                      {tool.tag}
                    </span>
                    <span className="font-mono text-[10px] text-chalk font-semibold">
                      {tool.tokenCost}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display text-base font-bold text-ink group-hover:text-chalk transition-colors">
                    {tool.title}
                  </h3>
                  <p className="font-sans text-xs text-graphite mt-1 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-2 border-t border-border/40 space-y-1.5 font-sans text-xs">
                  {tool.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-ink/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-quad shrink-0" />
                      <span className="text-[11px] truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => navigate(tool.route)}
                  className="w-full py-2.5 px-4 bg-secondary/20 hover:bg-chalk hover:text-white border border-border hover:border-chalk text-ink font-mono text-xs font-bold uppercase rounded-[4px] shadow-xs flex items-center justify-center gap-2 transition-all group-hover:bg-chalk group-hover:text-white"
                >
                  <span>{tool.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AIToolsHub;
