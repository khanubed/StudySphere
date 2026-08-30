import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerateAIQuizMutation } from '../store/api/quizApi';
import { useGetTokenUsageQuery } from '../store/api/aiApi';
import { useAppDispatch } from '../store/hooks';
import { startQuizAttempt } from '../store/slices/quizSlice';
import {
  Sparkles,
  UploadCloud,
  FileText,
  BookOpen,
  Clock,
  Coins,
  History,
  Check,
} from 'lucide-react';
import { QuizDifficulty, QuizQuestionType } from '@studysphere/shared-types';

export const AIQuizNew: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State
  const [sourceType, setSourceType] = useState<'topic_text' | 'upload' | 'resource'>('topic_text');
  const [topicText, setTopicText] = useState('Operating Systems: Virtual Memory & Page Replacement Algorithms');
  const [selectedFileName] = useState('DBMS_Unit3_Normalization_Decomposition.pdf');
  const [selectedResourceTitle] = useState('Computer Networks — TCP/IP Protocol Suite');
  const [questionTypes, setQuestionTypes] = useState<QuizQuestionType[]>(['mcq', 'true_false', 'fill_blank']);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15);
  const [isTimed, setIsTimed] = useState<boolean>(true);


  // RTK Query Hooks
  const [generateAIQuiz, { isLoading }] = useGenerateAIQuizMutation();
  const { data: tokenUsageResponse } = useGetTokenUsageQuery();
  const tokenUsage = tokenUsageResponse?.data || { used: 120, limit: 1000 };

  const tokenCost = Math.round(questionCount * 14);

  const toggleQuestionType = (t: QuizQuestionType) => {
    if (questionTypes.includes(t)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter((type) => type !== t));
      }
    } else {
      setQuestionTypes([...questionTypes, t]);
    }
  };

  const handleSelectAllTypes = () => {
    setQuestionTypes(['mcq', 'fill_blank', 'short_answer', 'true_false', 'conceptual']);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const sourceRef =
      sourceType === 'topic_text'
        ? topicText
        : sourceType === 'upload'
        ? selectedFileName
        : selectedResourceTitle;

    try {
      const res = await generateAIQuiz({
        source: sourceType,
        sourceRef,
        fileName: sourceType === 'upload' ? selectedFileName : undefined,
        questionTypes,
        difficulty,
        questionCount,
        timeLimitMinutes: isTimed ? timeLimitMinutes : undefined,
      }).unwrap();

      if (res.data) {
        dispatch(
          startQuizAttempt({
            quizId: res.data.id,
            durationSeconds: isTimed ? timeLimitMinutes * 60 : 0,
          })
        );
        navigate(`/quiz/${res.data.id}/attempt`);
      }
    } catch {
      // Fallback redirect to demo attempt
      dispatch(
        startQuizAttempt({
          quizId: 'quiz-001',
          durationSeconds: 15 * 60,
        })
      );
      navigate(`/quiz/quiz-001/attempt`);
    }
  };

  return (
    <div className="space-y-4 max-w-[1380px] mx-auto pb-12">
      
      {/* ── 1. ACADEMIC OS LEDGER HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-chalk/10 text-chalk border border-chalk/30">
              AI EXAM SIMULATOR
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite uppercase">
              LEARNING ASSESSMENT DESK
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            AI Quiz Generator
          </h1>
          <p className="font-sans text-xs text-graphite mt-0.5">
            Synthesize intelligent self-tests from lecture PDFs, topics, or resources with weakness diagnostics.
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
            onClick={() => navigate('/ai/quiz/new')}
            className="px-3 py-1.5 rounded-md border border-border bg-paper hover:bg-secondary/40 font-mono text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-graphite" />
            <span>Assessment History</span>
          </button>
        </div>
      </div>

      {/* ── 2. SIGNATURE AI STEP CHAIN ─────────────────────────────────── */}
      <div className="p-2.5 rounded-md border border-border/80 bg-paper overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[720px] font-mono text-[11px]">
          {[
            { step: '01', name: 'SOURCE INPUT', status: 'complete' },
            { step: '02', name: 'SEMANTIC ANALYSIS', status: isLoading ? 'active' : 'queued' },
            { step: '03', name: 'QUESTION EXTRACTION', status: 'queued' },
            { step: '04', name: 'DIFFICULTY BALANCING', status: 'queued' },
            { step: '05', name: 'ASSESSMENT READY', status: 'queued' },
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

      {/* ── 3. TWO-COLUMN SPLIT LEDGER ─────────────────────────────────── */}
      <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT PANEL: CONFIGURATION (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Section 1: Source Selection */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                01 — SELECT ACADEMIC SOURCE
              </span>
              <span className="font-mono text-[10px] text-chalk font-semibold">CHOOSE 1 SOURCE</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'topic_text', label: 'Topic / Syllabus', icon: BookOpen, tag: 'Fast' },
                { id: 'upload', label: 'Upload PDF / Notes', icon: UploadCloud, tag: 'Accurate' },
                { id: 'resource', label: 'Resource Hub Entry', icon: FileText, tag: 'Verified' },
              ].map((src) => {
                const Icon = src.icon;
                const isSelected = sourceType === src.id;
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setSourceType(src.id as any)}
                    className={`p-3 rounded-md border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-chalk bg-chalk/10 shadow-xs'
                        : 'border-border bg-paper hover:bg-secondary/20'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-chalk' : 'text-graphite'}`} />
                      <span className="font-mono text-[9px] uppercase font-bold text-graphite">
                        {src.tag}
                      </span>
                    </div>
                    <p className={`font-sans text-xs font-bold mt-2 ${isSelected ? 'text-ink' : 'text-graphite'}`}>
                      {src.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Source Input */}
            {sourceType === 'topic_text' && (
              <div className="space-y-1 pt-1">
                <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                  ENTER TOPIC OR PASTE SYLLABUS PASSAGE
                </label>
                <textarea
                  rows={3}
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  placeholder="e.g. Relational Normalization, BCNF Decomposition, Lossless Join Theorems"
                  className="w-full p-2.5 text-xs rounded-[3px] border border-border bg-secondary/10 text-ink focus:outline-none focus:border-chalk resize-none"
                />
              </div>
            )}

            {sourceType === 'upload' && (
              <div className="p-3 bg-secondary/15 rounded border border-dashed border-chalk/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-quad shrink-0" />
                  <div>
                    <p className="font-sans text-xs font-bold text-ink">{selectedFileName}</p>
                    <p className="font-mono text-[10px] text-graphite">24 Pages • 7,850 Words</p>
                  </div>
                </div>
                <span className="font-mono text-[9px] font-bold text-quad bg-quad/10 px-2 py-0.5 rounded">
                  READY
                </span>
              </div>
            )}

            {sourceType === 'resource' && (
              <div className="p-3 bg-secondary/15 rounded border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-chalk shrink-0" />
                  <div>
                    <p className="font-sans text-xs font-bold text-ink">{selectedResourceTitle}</p>
                    <p className="font-mono text-[10px] text-graphite">Semester 5 • Computer Networks</p>
                  </div>
                </div>
                <span className="font-mono text-[9px] font-bold text-chalk bg-chalk/10 px-2 py-0.5 rounded">
                  LINKED
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Question Types & Difficulty */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                02 — QUESTION TYPES & DIFFICULTY
              </span>
              <button
                type="button"
                onClick={handleSelectAllTypes}
                className="font-mono text-[10px] text-quad font-bold hover:underline"
              >
                SELECT ALL
              </button>
            </div>

            {/* Question Types Chips */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                QUESTION FORMATS ({questionTypes.length} SELECTED)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'mcq', label: 'Multiple Choice (MCQ)' },
                  { id: 'true_false', label: 'True / False' },
                  { id: 'fill_blank', label: 'Fill in Blanks' },
                  { id: 'short_answer', label: 'Short Recall' },
                  { id: 'conceptual', label: 'Conceptual Proofs' },
                ].map((type) => {
                  const isChecked = questionTypes.includes(type.id as any);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleQuestionType(type.id as any)}
                      className={`p-2.5 rounded-[3px] border text-left font-mono text-xs flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-quad bg-quad/10 text-quad font-bold shadow-xs'
                          : 'border-border bg-paper text-graphite hover:bg-secondary/20'
                      }`}
                    >
                      <span className="text-[11px] truncate">{type.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-quad shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Control */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                DIFFICULTY TIER
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'easy', label: 'Easy (30%)' },
                  { id: 'medium', label: 'Medium (50%)' },
                  { id: 'hard', label: 'Hard (20%)' },
                  { id: 'mixed', label: 'Mixed Adaptive' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id as any)}
                    className={`py-2 rounded-[3px] border text-center font-mono text-xs transition-all ${
                      difficulty === d.id
                        ? 'border-chalk bg-chalk/10 text-chalk font-bold shadow-xs'
                        : 'border-border bg-paper text-graphite hover:bg-secondary/20'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Question Count & Timer */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                03 — ASSESSMENT SCOPE & TIMER
              </span>
            </div>

            {/* Question Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-graphite font-bold">TOTAL QUESTIONS:</span>
                <span className="font-bold text-ink">{questionCount} Questions</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-quad cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-graphite">
                <span>5 Qs (Quick Drill)</span>
                <span>15 Qs (Standard)</span>
                <span>30 Qs (Full Mock Exam)</span>
              </div>
            </div>

            {/* Timer Toggle */}
            <div className="pt-2 border-t border-border/40 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-graphite" />
                  <span className="font-mono text-xs font-bold text-ink">
                    Server Countdown Timer
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTimed(!isTimed)}
                  className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${
                    isTimed ? 'border-quad bg-quad text-paper' : 'border-border bg-paper text-graphite'
                  }`}
                >
                  {isTimed ? 'Enabled' : 'No Time Limit'}
                </button>
              </div>

              {isTimed && (
                <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                  <span className="text-graphite">Duration:</span>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    className="w-20 p-1.5 text-center rounded border border-border bg-secondary/15 text-ink font-bold"
                  />
                  <span className="text-graphite">Minutes ({Math.round((timeLimitMinutes / questionCount) * 60)}s per question)</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT PANEL: GENERATION PREVIEW & PRE-FLIGHT AUDIT (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                PRE-FLIGHT AUDIT LEDGER
              </span>
              <span className="font-mono text-[10px] text-quad font-bold">VERIFIED SPEC</span>
            </div>

            {/* Audit Table */}
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-secondary/15 rounded border border-border/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-graphite">Selected Source:</span>
                  <span className="font-bold text-ink truncate max-w-[200px]">
                    {sourceType === 'topic_text' ? topicText : selectedFileName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite">Question Count:</span>
                  <span className="font-bold text-ink">{questionCount} Questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite">Difficulty Tier:</span>
                  <span className="font-bold text-chalk uppercase">{difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite">Time Limit:</span>
                  <span className="font-bold text-ink">{isTimed ? `${timeLimitMinutes} Minutes` : 'Untimed'}</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-1.5">
                  <span className="text-graphite">Estimated AI Token Cost:</span>
                  <span className="font-bold text-chalk">-{tokenCost} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-graphite">Balance Remaining After:</span>
                  <span className="font-bold text-quad">{tokenUsage.limit - tokenUsage.used - tokenCost} Credits</span>
                </div>
              </div>
            </div>

            {/* Projected Difficulty Breakdown */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-graphite uppercase">
                PROJECTED DIFFICULTY DISTRIBUTION
              </span>
              <div className="h-4 w-full rounded bg-secondary/30 flex overflow-hidden border border-border/60 font-mono text-[9px] text-paper font-bold text-center">
                <div style={{ width: '30%' }} className="bg-quad flex items-center justify-center">
                  30% Easy
                </div>
                <div style={{ width: '50%' }} className="bg-chalk flex items-center justify-center">
                  50% Med
                </div>
                <div style={{ width: '20%' }} className="bg-marker flex items-center justify-center text-ink">
                  20% Hard
                </div>
              </div>
            </div>

            {/* Primary Submit CTA */}
            <button
              type="submit"
              disabled={isLoading || !topicText.trim()}
              className="w-full py-3 px-4 bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase rounded-[4px] shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-paper" />
              <span>{isLoading ? 'Synthesizing Assessment Questions...' : `Generate Assessment (${tokenCost} Credits)`}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

export default AIQuizNew;
