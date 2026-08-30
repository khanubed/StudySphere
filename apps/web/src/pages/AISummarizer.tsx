import React, { useState, useEffect } from 'react';
import {
  useGetAISummarizerSessionsQuery,
  useGetAISummarizerSessionByIdQuery,
  usePreflightEstimateMutation,
  useSynthesizeStudyKitMutation,
  useGetTokenUsageQuery,
} from '../store/api/aiApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setActiveSessionId,
  setActiveSummaryTab,
  setActiveAssetAccordion,
  setSelectedDepth,
  setFlashcardIndex,
  toggleCardFlip,
  toggleCardMastery,
  setFilterQuestionType,
} from '../store/slices/summarizerSlice';
import {
  Sparkles,
  FileText,
  UploadCloud,
  Layers,
  HelpCircle,
  Network,
  Copy,
  Check,
  Download,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Coins,
  History,
  BookOpen,
  X,
  ArrowRight,
} from 'lucide-react';
import { SummaryDepth } from '@studysphere/shared-types';


export const AISummarizer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    activeSessionId,
    activeSummaryTab,
    activeAssetAccordion,
    selectedDepth,
    flashcardIndex,
    isCardFlipped,
    masteredCards,
    filterQuestionType,
  } = useAppSelector((state) => state.summarizer);

  // RTK Query Hooks
  const { data: sessionsResponse } = useGetAISummarizerSessionsQuery();
  const { data: activeSessionResponse } = useGetAISummarizerSessionByIdQuery(
    activeSessionId || 'sum-ses-001'
  );
  const { data: tokenUsageResponse } = useGetTokenUsageQuery();
  const [preflightEstimate, { data: estimateData }] = usePreflightEstimateMutation();
  const [synthesizeStudyKit, { isLoading: isSynthesizing }] = useSynthesizeStudyKitMutation();

  const sessions = sessionsResponse?.data || [];
  const session = activeSessionResponse?.data || sessions[0];
  const tokenUsage = tokenUsageResponse?.data || { used: 120, limit: 1000 };

  // Component Local State
  const [copied, setCopied] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isMindMapFullscreen, setIsMindMapFullscreen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    pages: number;
    words: number;
  } | null>({
    name: 'DBMS_Unit3_Normalization_Decomposition.pdf',
    size: 4280000,
    pages: 24,
    words: 7850,
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');

  // Trigger preflight calculation whenever file or depth changes
  useEffect(() => {
    if (selectedFile) {
      preflightEstimate({
        fileName: selectedFile.name,
        totalPages: selectedFile.pages,
        wordCount: selectedFile.words,
        depth: selectedDepth,
      });
    }
  }, [selectedFile, selectedDepth, preflightEstimate]);

  // Handle synthetic streaming effect on new session load
  useEffect(() => {
    if (session) {
      const fullText =
        activeSummaryTab === 'short'
          ? session.shortSummary
          : session.detailedSummary;
      setStreamedText(fullText);
    }
  }, [session, activeSummaryTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockPages = Math.max(4, Math.round(file.size / 180000));
      const mockWords = mockPages * 320;
      setSelectedFile({
        name: file.name,
        size: file.size,
        pages: mockPages,
        words: mockWords,
      });
    }
  };

  const handleSynthesize = async () => {
    if (!selectedFile) return;

    setIsStreaming(true);
    setStreamedText('');

    try {
      const res = await synthesizeStudyKit({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: 'application/pdf',
        totalPages: selectedFile.pages,
        wordCount: selectedFile.words,
        depth: selectedDepth,
        customPromptDirective: customPrompt.trim() || undefined,
      }).unwrap();

      if (res.data) {
        dispatch(setActiveSessionId(res.data.id));
      }
    } catch {
      // Fallback
    } finally {
      setIsStreaming(false);
    }
  };

  const currentFlashcard = session?.flashcards?.[flashcardIndex] || {
    id: 'fc-default',
    front: 'No flashcard available',
    back: 'No explanation available',
  };

  const filteredQuestions =
    session?.questions?.filter((q) =>
      filterQuestionType === 'all' ? true : q.type === filterQuestionType
    ) || [];

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto pb-12">
      
      {/* ── 1. ACADEMIC OS LEDGER HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-chalk/10 text-chalk border border-chalk/30">
              AI RESEARCH DESK
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite uppercase">
              STUDY KIT SYNTHESIZER
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            AI Notes Summarizer
          </h1>
          <p className="font-sans text-xs text-graphite mt-0.5">
            Transform raw lecture slides, textbooks, and syllabus notes into verified study kit ledgers.
          </p>
        </div>

        {/* Action controls & Token Indicator */}
        <div className="flex items-center gap-2.5">
          {/* Token Usage Indicator */}
          <div className="px-3 py-1.5 rounded-md border border-chalk/40 bg-chalk/10 flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-chalk" />
            <div className="font-mono text-xs">
              <span className="font-bold text-ink">{tokenUsage.limit - tokenUsage.used}</span>
              <span className="text-graphite"> / {tokenUsage.limit} Tokens</span>
            </div>
          </div>

          {/* History Ledger CTA */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-3 py-1.5 rounded-md border border-border bg-paper hover:bg-secondary/40 font-mono text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-graphite" />
            <span>History Ledger</span>
          </button>
        </div>
      </div>

      {/* ── 2. SIGNATURE AI STEP CHAIN PIPELINE ───────────────────────── */}
      <div className="p-2.5 rounded-md border border-border/80 bg-paper overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[720px] font-mono text-[11px]">
          {[
            { step: '01', name: 'DOCUMENT', status: selectedFile ? 'complete' : 'active' },
            { step: '02', name: 'SUMMARY', status: isStreaming ? 'active' : session ? 'complete' : 'queued' },
            { step: '03', name: 'SMART NOTES', status: isStreaming ? 'queued' : session ? 'complete' : 'queued' },
            { step: '04', name: 'FLASHCARDS', status: isStreaming ? 'queued' : session ? 'complete' : 'queued' },
            { step: '05', name: 'QUESTION BANK', status: isStreaming ? 'queued' : session ? 'complete' : 'queued' },
            { step: '06', name: 'MIND MAP', status: isStreaming ? 'queued' : session ? 'complete' : 'queued' },
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

      {/* ── 3. THREE-PANEL DESKTOP WORKSPACE ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── PANEL 1: DOCUMENT INPUT & CONFIG (Left — 3.5 cols) ────── */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                01 — DOCUMENT INPUT
              </span>
              <span className="font-mono text-[10px] text-chalk font-semibold">MAX 25MB</span>
            </div>

            {/* Dropzone */}
            <label className="block p-4 border border-dashed border-border/80 hover:border-chalk rounded-md bg-secondary/10 cursor-pointer text-center space-y-2 transition-colors">
              <input
                type="file"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-7 h-7 text-chalk mx-auto" />
              <div>
                <p className="font-sans text-xs font-bold text-ink">
                  Click to Browse or Drag Lecture PDF
                </p>
                <p className="font-mono text-[10px] text-graphite mt-0.5">
                  PDF, DOCX, PPTX, TXT
                </p>
              </div>
            </label>

            {/* Selected File Card */}
            {selectedFile && (
              <div className="p-2.5 rounded-[4px] bg-secondary/20 border border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-quad shrink-0" />
                  <div className="truncate">
                    <p className="font-sans text-xs font-bold text-ink truncate">
                      {selectedFile.name}
                    </p>
                    <p className="font-mono text-[10px] text-graphite">
                      {selectedFile.pages} Pages • {(selectedFile.size / 1000000).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[9px] font-bold text-quad bg-quad/10 px-1.5 py-0.5 rounded-[2px]">
                  READY
                </span>
              </div>
            )}

            {/* Depth Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] font-bold text-graphite uppercase">
                EXTRACTION DEPTH
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'quick', label: 'Quick', cost: '120 ops' },
                  { id: 'standard', label: 'Standard', cost: '320 ops' },
                  { id: 'detailed', label: 'Detailed', cost: '540 ops' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => dispatch(setSelectedDepth(d.id as SummaryDepth))}
                    className={`p-2 rounded-[3px] border text-center font-mono text-[11px] transition-all ${
                      selectedDepth === d.id
                        ? 'border-chalk bg-chalk/10 text-chalk font-bold shadow-xs'
                        : 'border-border bg-paper text-graphite hover:bg-secondary/20'
                    }`}
                  >
                    <div>{d.label}</div>
                    <div className="text-[9px] text-graphite opacity-80 mt-0.5">{d.cost}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-Flight Metadata Ledger */}
            <div className="p-3 bg-secondary/15 rounded-md border border-border/60 font-mono text-[11px] space-y-1.5">
              <div className="text-[10px] font-bold text-graphite uppercase pb-1 border-b border-border/40">
                PRE-FLIGHT AUDIT LEDGER
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Total Pages:</span>
                <span className="font-bold text-ink">{selectedFile?.pages || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Detected Words:</span>
                <span className="font-bold text-ink">{selectedFile?.words || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Estimated Tokens:</span>
                <span className="font-bold text-chalk">
                  {estimateData?.data?.estimatedTokens || 420} ops
                </span>
              </div>
              <div className="flex justify-between border-t border-border/40 pt-1">
                <span className="text-graphite">Status Check:</span>
                <span className="font-bold text-quad">✓ Sufficient Balance</span>
              </div>
            </div>

            {/* Custom Directive Input */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                Custom Focus Directive (Optional)
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus on BCNF decomposition proofs"
                className="w-full p-2 text-xs rounded-[3px] border border-border bg-secondary/10 text-ink focus:outline-none focus:border-chalk"
              />
            </div>

            {/* Synthesize Button */}
            <button
              type="button"
              disabled={isSynthesizing || !selectedFile}
              onClick={handleSynthesize}
              className="w-full py-2.5 px-4 bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase rounded-[4px] shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-paper" />
              <span>{isSynthesizing ? 'Synthesizing Study Kit...' : 'Synthesize Study Kit'}</span>
            </button>
          </div>
        </div>

        {/* ── PANEL 2: PRIMARY SYNTHESIS & STREAMING (Center — 5 cols) ─ */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs min-h-[580px] flex flex-col justify-between">
            <div>
              {/* Header & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div className="flex items-center gap-1 bg-secondary/30 p-0.5 rounded-[4px] border border-border/60">
                  <button
                    onClick={() => dispatch(setActiveSummaryTab('short'))}
                    className={`px-2.5 py-1 rounded-[3px] font-mono text-xs ${
                      activeSummaryTab === 'short'
                        ? 'bg-quad text-paper font-bold'
                        : 'text-graphite font-medium hover:text-ink'
                    }`}
                  >
                    Executive Summary
                  </button>
                  <button
                    onClick={() => dispatch(setActiveSummaryTab('detailed'))}
                    className={`px-2.5 py-1 rounded-[3px] font-mono text-xs ${
                      activeSummaryTab === 'detailed'
                        ? 'bg-quad text-paper font-bold'
                        : 'text-graphite font-medium hover:text-ink'
                    }`}
                  >
                    Comprehensive Notes
                  </button>
                </div>

                {/* Copy / Export Action Toolbar */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(streamedText)}
                    className="p-1.5 rounded-[3px] border border-border bg-paper hover:bg-secondary/30 text-graphite hover:text-ink text-xs flex items-center gap-1 font-mono"
                    title="Copy Summary"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-quad" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => alert('Exporting PDF Study Kit...')}
                    className="p-1.5 rounded-[3px] border border-border bg-paper hover:bg-secondary/30 text-graphite hover:text-ink text-xs flex items-center gap-1 font-mono"
                    title="Export PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Title & Document Source Citation */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase font-bold text-quad bg-quad/10 px-1.5 py-0.5 rounded-[2px] border border-quad/30">
                    VERIFIED EXTRACTION
                  </span>
                  <span className="font-mono text-[10px] text-graphite">
                    Derived from {session?.totalPages || 24} Pages
                  </span>
                </div>
                <h2 className="font-display text-lg font-bold text-ink mt-1">
                  {session?.title || 'Academic Summary'}
                </h2>
              </div>

              {/* Synthesis Text Body */}
              <div className="mt-3 p-4 rounded-md bg-secondary/10 border border-border/40 text-xs font-sans text-ink leading-relaxed space-y-3">
                {isStreaming ? (
                  <div className="py-12 text-center space-y-2">
                    <Sparkles className="w-6 h-6 text-chalk animate-spin mx-auto" />
                    <p className="font-mono text-xs text-graphite">
                      Vectorizing semantic chunks & synthesizing study kit...
                    </p>
                  </div>
                ) : (
                  <div className="whitespace-pre-line leading-relaxed font-sans text-xs">
                    {streamedText}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Metadata Stamp */}
            <div className="pt-3 border-t border-border/40 flex items-center justify-between font-mono text-[10px] text-graphite">
              <span>LEDGER ID: #{session?.id || 'sum-001'}</span>
              <span>TOKENS CHARGED: {session?.tokensUsed || 420} OPS</span>
            </div>
          </div>
        </div>

        {/* ── PANEL 3: MULTI-ASSET STUDY WORKBENCH (Right — 3.5 cols) ─ */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                02 — STUDY ASSETS WORKBENCH
              </span>
              <span className="font-mono text-[10px] text-quad font-bold">4 LEDGERS</span>
            </div>

            {/* Asset Accordion Nav Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-secondary/20 rounded-md border border-border/60">
              {[
                { id: 'notes', label: 'Notes', icon: BookOpen },
                { id: 'flashcards', label: 'Cards', icon: Layers },
                { id: 'questions', label: 'Questions', icon: HelpCircle },
                { id: 'mindmap', label: 'Map', icon: Network },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeAssetAccordion === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => dispatch(setActiveAssetAccordion(tab.id as any))}
                    className={`py-1.5 px-1 rounded-[3px] flex flex-col items-center gap-1 font-mono text-[10px] transition-all ${
                      isSelected
                        ? 'bg-quad text-paper font-bold shadow-xs'
                        : 'text-graphite hover:text-ink'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ACCORDION 1: SMART NOTES & FORMULAS */}
            {activeAssetAccordion === 'notes' && (
              <div className="space-y-3 pt-1">
                {/* Key Concepts Table */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-bold text-graphite uppercase">
                    KEY CONCEPTS & DEFINITIONS ({session?.keyConcepts?.length || 0})
                  </span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {session?.keyConcepts?.map((kc: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-[4px] bg-secondary/15 border border-border/60 space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs font-bold text-ink">
                            {kc.term}
                          </span>
                          <span className="font-mono text-[9px] uppercase font-bold text-quad bg-quad/10 px-1 py-0.2 rounded-[2px]">
                            {kc.examRelevance || 'HIGH'}
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-graphite leading-snug">
                          {kc.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula Sheets */}
                {session?.formulas && session.formulas.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <span className="font-mono text-[10px] font-bold text-graphite uppercase">
                      FORMULA & THEOREM LEDGER
                    </span>
                    <div className="space-y-2">
                      {session.formulas.map((f) => (
                        <div
                          key={f.id}
                          className="p-2.5 rounded-[4px] bg-secondary/15 border border-border/60 space-y-1.5"
                        >
                          <p className="font-mono text-xs font-bold text-ink">{f.title}</p>
                          <div className="p-2 bg-paper rounded-[3px] border border-border/80 font-mono text-xs text-center text-quad font-bold">
                            {f.latex}
                          </div>
                          <p className="font-sans text-[10px] text-graphite">{f.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACCORDION 2: 3D INTERACTIVE FLASHCARDS */}
            {activeAssetAccordion === 'flashcards' && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-graphite uppercase">
                    FLASHCARD DECK ({flashcardIndex + 1} / {session?.flashcards?.length || 1})
                  </span>
                  <span className="font-mono text-[10px] text-quad font-bold">
                    {masteredCards.length} Mastered
                  </span>
                </div>

                {/* Interactive Card Surface */}
                <div
                  onClick={() => dispatch(toggleCardFlip())}
                  className="w-full min-h-[190px] p-5 rounded-md border border-border/80 bg-secondary/15 hover:border-chalk cursor-pointer flex flex-col justify-between transition-all"
                >
                  <div className="flex justify-between items-center font-mono text-[9px] uppercase">
                    <span className="font-bold text-chalk">
                      {currentFlashcard.tag || 'TOPIC'}
                    </span>
                    <span className="text-graphite">
                      {isCardFlipped ? 'BACK (ANSWER)' : 'FRONT (QUESTION)'}
                    </span>
                  </div>

                  <div className="py-4 text-center">
                    <p className="font-sans text-sm font-bold text-ink leading-snug">
                      {isCardFlipped ? currentFlashcard.back : currentFlashcard.front}
                    </p>
                    <p className="font-mono text-[10px] text-graphite mt-3">
                      (Click to flip card)
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-graphite">
                    <span>StudySphere Deck</span>
                    <span>{isCardFlipped ? '✓ Answer Verified' : 'Tap to reveal'}</span>
                  </div>
                </div>

                {/* Card Controls & Mastery */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={flashcardIndex === 0}
                      onClick={() => dispatch(setFlashcardIndex(Math.max(0, flashcardIndex - 1)))}
                      className="p-2 rounded-[3px] border border-border bg-paper text-ink disabled:opacity-40"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={flashcardIndex >= (session?.flashcards?.length || 1) - 1}
                      onClick={() =>
                        dispatch(
                          setFlashcardIndex(
                            Math.min((session?.flashcards?.length || 1) - 1, flashcardIndex + 1)
                          )
                        )
                      }
                      className="p-2 rounded-[3px] border border-border bg-paper text-ink disabled:opacity-40"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(toggleCardMastery(currentFlashcard.id))}
                    className={`px-3 py-1.5 rounded-[3px] border font-mono text-xs font-bold uppercase transition-colors ${
                      masteredCards.includes(currentFlashcard.id)
                        ? 'border-quad bg-quad text-paper'
                        : 'border-border bg-paper text-graphite hover:text-ink'
                    }`}
                  >
                    {masteredCards.includes(currentFlashcard.id) ? '✓ Mastered' : 'Mark Mastered'}
                  </button>
                </div>
              </div>
            )}

            {/* ACCORDION 3: EXAM & VIVA QUESTIONS */}
            {activeAssetAccordion === 'questions' && (
              <div className="space-y-3 pt-1">
                {/* Filter Pills */}
                <div className="flex items-center gap-1">
                  {(['all', 'short', 'long', 'viva'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => dispatch(setFilterQuestionType(t))}
                      className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] capitalize border ${
                        filterQuestionType === t
                          ? 'border-quad bg-quad text-paper font-bold'
                          : 'border-border bg-paper text-graphite hover:text-ink'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Questions List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-[4px] bg-secondary/15 border border-border/60 space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] uppercase font-bold text-quad bg-quad/10 px-1 py-0.5 rounded-[2px]">
                          {q.type.toUpperCase()} ({q.marks} MARKS)
                        </span>
                      </div>
                      <p className="font-sans text-xs font-bold text-ink">{q.question}</p>
                      <div className="p-2 bg-paper rounded-[3px] border border-border/60 space-y-1">
                        <p className="font-mono text-[9px] font-bold text-graphite uppercase">
                          MODEL ANSWER GUIDE:
                        </p>
                        <p className="font-sans text-[11px] text-graphite leading-relaxed">
                          {q.modelAnswer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACCORDION 4: KNOWLEDGE MIND MAP */}
            {activeAssetAccordion === 'mindmap' && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-graphite uppercase">
                    VISUAL KNOWLEDGE TREE
                  </span>
                  <button
                    onClick={() => setIsMindMapFullscreen(true)}
                    className="p-1 rounded-[2px] border border-border text-graphite hover:text-ink"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Interactive SVG Tree Visualizer */}
                <div className="p-3 rounded-md bg-secondary/15 border border-border/60 overflow-x-auto min-h-[220px]">
                  <div className="font-mono text-xs space-y-2">
                    <div className="p-2 rounded bg-quad text-paper font-bold text-center">
                      {session?.mindMap?.label || 'Core Concept Root'}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {session?.mindMap?.children?.map((child, idx) => (
                        <div key={idx} className="p-2 rounded bg-paper border border-border space-y-1">
                          <p className="font-bold text-ink text-[11px]">{child.label}</p>
                          {child.children && (
                            <ul className="text-[10px] text-graphite space-y-0.5 list-disc list-inside">
                              {child.children.map((sub, sidx) => (
                                <li key={sidx}>{sub.label}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ── 4. HISTORY DRAWER MODAL ───────────────────────────────────── */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-paper rounded-lg border border-border p-5 space-y-4 shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-border/60">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-quad">
                  STUDY SESSIONS LEDGER
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  Past Synthesized Study Kits ({sessions.length})
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-[4px] hover:bg-secondary/40 text-graphite hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {sessions.map((ses) => (
                <div
                  key={ses.id}
                  onClick={() => {
                    dispatch(setActiveSessionId(ses.id));
                    setIsHistoryModalOpen(false);
                  }}
                  className={`p-3.5 rounded-md border cursor-pointer flex justify-between items-center transition-all ${
                    ses.id === activeSessionId
                      ? 'border-quad bg-quad/10 shadow-xs'
                      : 'border-border bg-paper hover:bg-secondary/20'
                  }`}
                >
                  <div className="space-y-1 max-w-[440px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] uppercase font-bold text-chalk bg-chalk/10 px-1.5 py-0.5 rounded-[2px]">
                        {ses.depth.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px] text-graphite">
                        {new Date(ses.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-sans text-xs font-bold text-ink">{ses.title}</p>
                    <p className="font-mono text-[10px] text-graphite">
                      {ses.totalPages} Pages • {ses.wordCount} Words • {ses.tokensUsed} Tokens
                    </p>
                  </div>

                  <span className="font-mono text-xs font-bold text-quad flex items-center gap-1">
                    Open Kit <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. FULLSCREEN MIND MAP MODAL ──────────────────────────────── */}
      {isMindMapFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-paper rounded-lg border border-border p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-border/60">
              <h3 className="font-display text-lg font-bold text-ink">
                Visual Knowledge Map: {session?.title}
              </h3>
              <button
                onClick={() => setIsMindMapFullscreen(false)}
                className="p-1 rounded-[4px] hover:bg-secondary/40 text-graphite hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-secondary/15 rounded-md border border-border/60 min-h-[400px]">
              <div className="font-mono text-sm space-y-4">
                <div className="p-3 rounded bg-quad text-paper font-bold text-center text-base">
                  {session?.mindMap?.label}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                  {session?.mindMap?.children?.map((child, idx) => (
                    <div key={idx} className="p-3 rounded bg-paper border border-border space-y-2">
                      <p className="font-bold text-ink text-xs">{child.label}</p>
                      {child.children && (
                        <ul className="text-xs text-graphite space-y-1 list-disc list-inside">
                          {child.children.map((sub, sidx) => (
                            <li key={sidx}>{sub.label}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AISummarizer;
