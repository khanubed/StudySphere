import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalyzeAssignmentMutation, useGetTokenUsageQuery } from '../store/api/aiApi';
import {
  mockAssignmentRawText,
  mockGrammarIssues,
  mockCitations,
  mockWritingScore,
  mockStructureOutline,
} from '@studysphere/shared-data';
import {
  Sparkles,
  FileText,
  RotateCcw,
  Coins,
  History,
  Copy,
  Check,
  Download,
  GraduationCap,
} from 'lucide-react';
import { CitationStyleType, GrammarIssue } from '@studysphere/shared-types';

export const AIAssignmentHelper: React.FC = () => {
  const navigate = useNavigate();
  const { data: tokenUsageResponse } = useGetTokenUsageQuery();
  const tokenUsage = tokenUsageResponse?.data || { used: 120, limit: 1000 };

  // Form State
  const [sourceType, setSourceType] = useState<'text' | 'upload'>('text');
  const [manuscriptText, setManuscriptText] = useState<string>(mockAssignmentRawText);
  const [uploadedFileName] = useState<string>('Distributed_Consensus_Consensus_Paper.docx');
  const [citationStyle, setCitationStyle] = useState<CitationStyleType>('IEEE');
  const [checkGrammar, setCheckGrammar] = useState(true);
  const [checkTone, setCheckTone] = useState(true);
  const [checkCitations, setCheckCitations] = useState(true);
  const [checkStructure, setCheckStructure] = useState(true);

  // Analysis State
  const [analyzeAssignment, { isLoading }] = useAnalyzeAssignmentMutation();
  const [issues, setIssues] = useState<GrammarIssue[]>(mockGrammarIssues);

  const [activeIssueId, setActiveIssueId] = useState<string | null>('iss-001');
  const [writingScore, setWritingScore] = useState(mockWritingScore);
  const [activeRightTab, setActiveRightTab] = useState<'scores' | 'citations' | 'structure'>('scores');
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  // Manuscript Metrics
  const wordCount = manuscriptText.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Number((wordCount / 250).toFixed(1)));
  const tokenCost = 10;

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuscriptText.trim()) return;

    try {
      await analyzeAssignment({
        text: manuscriptText,
        citationStyle,
        fileName: sourceType === 'upload' ? uploadedFileName : undefined,
      }).unwrap();
    } catch {
      // Fallback
    }

  };

  const handleAcceptIssue = (issue: GrammarIssue) => {
    const updatedText = manuscriptText.replace(issue.originalText, issue.suggestedText);
    setManuscriptText(updatedText);
    setIssues(
      issues.map((iss) => (iss.id === issue.id ? { ...iss, status: 'accepted' } : iss))
    );
    // Recalculate score live
    setWritingScore((prev) => ({
      ...prev,
      overall: Math.min(100, prev.overall + 2),
      grammar: Math.min(100, prev.grammar + 2),
      tone: Math.min(100, prev.tone + 2),
    }));
    setActiveIssueId(null);
  };

  const handleRejectIssue = (issueId: string) => {
    setIssues(
      issues.map((iss) => (iss.id === issueId ? { ...iss, status: 'rejected' } : iss))
    );
    setActiveIssueId(null);
  };

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitationId(id);
    setTimeout(() => setCopiedCitationId(null), 2000);
  };

  const activeIssue = issues.find((iss) => iss.id === activeIssueId);
  const unresolvedIssues = issues.filter((iss) => iss.status === 'pending');

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto pb-12">
      
      {/* ── 1. ACADEMIC OS LEDGER HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-chalk/10 text-chalk border border-chalk/30">
              ACADEMIC WRITING STUDIO
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite uppercase">
              PRE-SUBMISSION PEER REVIEW DESK
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            AI Assignment & Citation Helper
          </h1>
          <p className="font-sans text-xs text-graphite mt-0.5">
            Audit manuscript drafts for academic tone, grammar precision, IMRaD section hierarchy, and IEEE/APA citations.
          </p>
        </div>

        {/* Action Controls & Token Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-md border border-chalk/40 bg-chalk/10 flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-chalk" />
            <div className="font-mono text-xs">
              <span className="font-bold text-ink">{tokenUsage.limit - tokenUsage.used}</span>
              <span className="text-graphite"> / {tokenUsage.limit} Tokens</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai')}
            className="px-3 py-1.5 rounded-md border border-border bg-paper hover:bg-secondary/40 font-mono text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-graphite" />
            <span>Audit History</span>
          </button>

          <button
            onClick={() => alert('Exporting clean academic DOCX manuscript...')}
            className="px-3 py-1.5 rounded-md bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manuscript ▾</span>
          </button>
        </div>
      </div>

      {/* ── 2. SIGNATURE AI STEP CHAIN ─────────────────────────────────── */}
      <div className="p-2.5 rounded-md border border-border/80 bg-paper overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[760px] font-mono text-[11px]">
          {[
            { step: '01', name: 'DOCUMENT PARSE', status: 'complete' },
            { step: '02', name: 'GRAMMAR & CONCORD', status: 'complete' },
            { step: '03', name: 'ACADEMIC TONE', status: 'complete' },
            { step: '04', name: 'CITATION VALIDATION', status: 'complete' },
            { step: '05', name: 'STRUCTURE TREE', status: 'complete' },
            { step: '06', name: 'REPORT READY', status: 'complete' },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.name}>
              <div
                className={`px-2.5 py-1 rounded-[3px] flex items-center gap-1.5 border ${
                  item.status === 'active'
                    ? 'bg-chalk/15 border-chalk text-chalk font-bold animate-pulse'
                    : item.status === 'complete'
                    ? 'bg-quad/10 border-quad/40 text-quad font-bold'
                    : 'bg-secondary/20 border-border text-graphite'
                }`}
              >
                <span>{item.status === 'complete' ? '✓' : item.step}</span>
                <span>{item.name}</span>
              </div>
              {idx !== arr.length - 1 && (
                <span className="text-graphite text-xs">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 3. THREE-PANEL ACADEMIC WORKSPACE ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── PANEL 1: INGESTION & CONFIGURATION (3.5 Cols) ───────────── */}
        <div className="lg:col-span-3 space-y-3">
          <form onSubmit={handleRunAudit} className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                MANUSCRIPT INGESTION
              </span>
              <span className="font-mono text-[10px] text-chalk font-bold">10 CREDITS</span>
            </div>

            {/* Input Mode Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-secondary/20 rounded border border-border/60">
              <button
                type="button"
                onClick={() => setSourceType('text')}
                className={`py-1.5 rounded font-mono text-xs font-bold transition-all ${
                  sourceType === 'text'
                    ? 'bg-paper text-ink shadow-xs border border-border/60'
                    : 'text-graphite hover:text-ink'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setSourceType('upload')}
                className={`py-1.5 rounded font-mono text-xs font-bold transition-all ${
                  sourceType === 'upload'
                    ? 'bg-paper text-ink shadow-xs border border-border/60'
                    : 'text-graphite hover:text-ink'
                }`}
              >
                Upload File
              </button>
            </div>

            {sourceType === 'upload' && (
              <div className="p-3 bg-secondary/15 rounded border border-dashed border-chalk/60 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 pr-2">
                  <FileText className="w-5 h-5 text-quad shrink-0" />
                  <div className="truncate">
                    <p className="font-sans text-xs font-bold text-ink truncate">{uploadedFileName}</p>
                    <p className="font-mono text-[10px] text-graphite">DOCX • 1.4 MB</p>
                  </div>
                </div>
                <span className="font-mono text-[9px] font-bold text-quad bg-quad/10 px-1.5 py-0.5 rounded">
                  READY
                </span>
              </div>
            )}

            {/* Live Manuscript Telemetry */}
            <div className="p-3 bg-secondary/15 rounded border border-border/60 font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-graphite">Total Word Count:</span>
                <span className="font-bold text-ink">{wordCount} Words</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Est. Reading Time:</span>
                <span className="font-bold text-ink">{readingTimeMinutes} Minutes</span>
              </div>
              <div className="flex justify-between border-t border-border/40 pt-1">
                <span className="text-graphite">Analysis Cost:</span>
                <span className="font-bold text-chalk">{tokenCost} AI Credits</span>
              </div>
            </div>

            {/* Audit Scopes Multi-Select */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                AUDIT SCOPES
              </label>
              <div className="space-y-1 font-sans text-xs">
                {[
                  { label: 'Grammar, Concord & Spelling', state: checkGrammar, setter: setCheckGrammar },
                  { label: 'Academic Tone & Vocabulary', state: checkTone, setter: setCheckTone },
                  { label: 'Citation Integrity & DOIs', state: checkCitations, setter: setCheckCitations },
                  { label: 'IMRaD Structure Outline', state: checkStructure, setter: setCheckStructure },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/20 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="accent-quad"
                    />
                    <span className="text-ink text-[11px] font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Citation Standard */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                TARGET CITATION STANDARD
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['IEEE', 'APA', 'MLA'] as CitationStyleType[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCitationStyle(style)}
                    className={`py-1.5 rounded font-mono text-xs font-bold border transition-all ${
                      citationStyle === style
                        ? 'border-chalk bg-chalk/10 text-chalk shadow-xs'
                        : 'border-border bg-paper text-graphite hover:bg-secondary/20'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              disabled={isLoading || !manuscriptText.trim()}
              className="w-full py-2.5 px-4 bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase rounded shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Auditing Manuscript...' : 'Run Academic Audit ↗'}</span>
            </button>
          </form>
        </div>

        {/* ── PANEL 2: MANUSCRIPT EDITOR CANVAS (6 Cols) ──────────────── */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-5 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs min-h-[680px] flex flex-col justify-between">
            
            <div className="space-y-3">
              {/* Canvas Header */}
              <div className="flex justify-between items-center pb-2 border-b border-border/60 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">MANUSCRIPT CANVAS</span>
                  <span className="text-graphite">• {unresolvedIssues.length} Suggestions Pending</span>
                </div>
                <span className="text-[10px] text-graphite">Click highlights to review</span>
              </div>

              {/* Editable Text Area with Visual Highlight Markup */}
              <div className="space-y-2">
                <textarea
                  rows={14}
                  value={manuscriptText}
                  onChange={(e) => setManuscriptText(e.target.value)}
                  placeholder="Paste or write your academic manuscript draft here..."
                  className="w-full p-3 font-sans text-xs rounded border border-border/80 bg-secondary/5 text-ink leading-relaxed focus:outline-none focus:border-chalk resize-none"
                />

                {/* Inline Highlight Chips Bar */}
                <div className="p-3 bg-secondary/15 rounded border border-border/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase font-bold text-graphite">
                      INTERACTIVE EDITORIAL MARKS ({issues.length})
                    </span>
                    <span className="font-mono text-[9px] text-graphite">
                      Red: Grammar • Yellow: Tone • Blue: Vocab
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {issues.map((iss) => {
                      const isSelected = activeIssueId === iss.id;
                      const isResolved = iss.status !== 'pending';

                      return (
                        <button
                          key={iss.id}
                          type="button"
                          onClick={() => setActiveIssueId(iss.id)}
                          className={`px-2 py-1 rounded border text-left font-sans text-[11px] flex items-center gap-1.5 transition-all ${
                            isResolved
                              ? 'border-border/40 bg-secondary/20 text-graphite line-through opacity-60'
                              : isSelected
                              ? 'border-chalk bg-chalk/20 text-ink font-bold shadow-xs'
                              : iss.category === 'grammar'
                              ? 'border-destructive/40 bg-destructive/10 text-destructive font-semibold'
                              : iss.category === 'tone'
                              ? 'border-marker/40 bg-marker/15 text-ink font-semibold'
                              : 'border-chalk/40 bg-chalk/10 text-chalk font-semibold'
                          }`}
                        >
                          <span className="font-mono text-[9px] font-bold">L{iss.line}</span>
                          <span className="truncate max-w-[140px]">{iss.originalText}</span>
                          {iss.status === 'accepted' && <Check className="w-3 h-3 text-quad" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Floating Contextual GrammarIssueCard */}
                {activeIssue && activeIssue.status === 'pending' && (
                  <div className="p-4 rounded-md border border-chalk/60 bg-chalk/5 space-y-3 animate-in fade-in-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                            activeIssue.category === 'grammar'
                              ? 'border-destructive/30 bg-destructive/10 text-destructive'
                              : 'border-marker/30 bg-marker/20 text-ink'
                          }`}
                        >
                          {activeIssue.category.toUpperCase()} ISSUE • LINE {activeIssue.line}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-graphite">Alt + A to Accept</span>
                    </div>

                    <p className="font-sans text-xs text-graphite leading-relaxed">
                      {activeIssue.explanation}
                    </p>

                    {/* Diff Representation */}
                    <div className="p-2.5 rounded bg-paper border border-border/80 font-mono text-xs space-y-1">
                      <div className="flex items-center gap-2 text-destructive">
                        <span className="font-bold">-</span>
                        <span className="line-through">{activeIssue.originalText}</span>
                      </div>
                      <div className="flex items-center gap-2 text-quad font-bold">
                        <span>+</span>
                        <span>{activeIssue.suggestedText}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAcceptIssue(activeIssue)}
                        className="flex-1 py-1.5 rounded bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Replace (Alt+A)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectIssue(activeIssue.id)}
                        className="px-3 py-1.5 rounded border border-border bg-paper hover:bg-secondary/30 font-mono text-xs font-semibold text-graphite"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Editor Bar */}
            <div className="pt-3 border-t border-border/60 flex justify-between items-center font-mono text-xs text-graphite">
              <span>Academic OS Typography Engine • IEEE/APA Ready</span>
              <button
                type="button"
                onClick={() => setManuscriptText(mockAssignmentRawText)}
                className="hover:text-ink flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Sample
              </button>
            </div>

          </div>
        </div>

        {/* ── PANEL 3: DIAGNOSTIC ACCORDION LEDGER (2.5 Cols) ─────────── */}
        <div className="lg:col-span-3 space-y-3">
          
          {/* Tab Switcher */}
          <div className="p-1 bg-secondary/20 rounded border border-border/60 flex gap-1 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setActiveRightTab('scores')}
              className={`flex-1 py-1.5 rounded font-bold transition-all ${
                activeRightTab === 'scores'
                  ? 'bg-paper text-ink shadow-xs border border-border/60'
                  : 'text-graphite hover:text-ink'
              }`}
            >
              Scores
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('citations')}
              className={`flex-1 py-1.5 rounded font-bold transition-all ${
                activeRightTab === 'citations'
                  ? 'bg-paper text-ink shadow-xs border border-border/60'
                  : 'text-graphite hover:text-ink'
              }`}
            >
              Citations ({mockCitations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('structure')}
              className={`flex-1 py-1.5 rounded font-bold transition-all ${
                activeRightTab === 'structure'
                  ? 'bg-paper text-ink shadow-xs border border-border/60'
                  : 'text-graphite hover:text-ink'
              }`}
            >
              Structure
            </button>
          </div>

          {/* TAB 1: SCORES CARD */}
          {activeRightTab === 'scores' && (
            <div className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="font-mono text-xs font-bold text-graphite uppercase">
                  WRITING QUALITY SCORE
                </span>
                <span className="font-mono text-[10px] text-quad font-bold">COLLEGIATE GRADE</span>
              </div>

              {/* Overall Grade Card */}
              <div className="p-3.5 rounded bg-quad/10 border border-quad/30 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-quad">COMPOSITE SCORE</span>
                  <p className="font-mono text-3xl font-bold text-ink">{writingScore.overall} / 100</p>
                </div>
                <GraduationCap className="w-8 h-8 text-quad" />
              </div>

              {/* Multi-Dimensional Sliders */}
              <div className="space-y-2.5 font-mono text-xs">
                {[
                  { label: 'Readability (Flesch)', val: writingScore.readability },
                  { label: 'Clarity & Precision', val: writingScore.clarity },
                  { label: 'Grammar Accuracy', val: writingScore.grammar },
                  { label: 'Academic Tone', val: writingScore.tone },
                  { label: 'Section Structure', val: writingScore.structure },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-graphite">{item.label}:</span>
                      <span className="font-bold text-ink">{item.val}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-secondary/30 overflow-hidden">
                      <div style={{ width: `${item.val}%` }} className="h-full bg-quad" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CITATIONS WORKSPACE */}
          {activeRightTab === 'citations' && (
            <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="font-mono text-xs font-bold text-graphite uppercase">
                  CITATION INTEGRITY ({citationStyle})
                </span>
                <span className="font-mono text-[10px] text-quad font-bold">AUTO-FORMATTED</span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                {mockCitations.map((cit) => (
                  <div
                    key={cit.id}
                    className="p-3 rounded bg-secondary/15 border border-border/60 space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] uppercase font-bold text-chalk">
                        {cit.style} ENTRY
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCitation(cit.id, cit.formattedText)}
                        className="flex items-center gap-1 font-mono text-[10px] font-semibold text-graphite hover:text-ink"
                      >
                        {copiedCitationId === cit.id ? (
                          <span className="text-quad font-bold">Copied ✓</span>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="font-mono text-[11px] text-ink leading-relaxed">
                      {cit.formattedText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STRUCTURE OUTLINE TREE */}
          {activeRightTab === 'structure' && (
            <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="font-mono text-xs font-bold text-graphite uppercase">
                  IMRaD SECTION TREE
                </span>
                <span className="font-mono text-[10px] text-chalk font-bold">HIERARCHY</span>
              </div>

              <div className="space-y-2">
                {mockStructureOutline.map((sec, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border space-y-1 ${
                      sec.status === 'found'
                        ? 'border-border/60 bg-secondary/10'
                        : 'border-marker/40 bg-marker/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-xs font-bold text-ink">{sec.section}</span>
                      <span
                        className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          sec.status === 'found'
                            ? 'bg-quad/10 text-quad'
                            : 'bg-marker/20 text-ink'
                        }`}
                      >
                        {sec.status === 'found' ? 'Found ✓' : 'Missing ⚑'}
                      </span>
                    </div>

                    {sec.recommendation && (
                      <p className="font-sans text-[10px] text-graphite leading-relaxed">
                        {sec.recommendation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AIAssignmentHelper;
