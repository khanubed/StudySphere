import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetQuizResultQuery } from '../store/api/quizApi';
import {
  Award,
  Clock,
  RotateCcw,
  Download,
  TrendingUp,
} from 'lucide-react';

export const QuizResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const attemptId = searchParams.get('attemptId') || 'attempt-001';
  const { data: resultResponse, isLoading } = useGetQuizResultQuery(attemptId);

  const result = resultResponse?.data;

  if (isLoading) {
    return (
      <div className="p-12 text-center font-mono text-sm text-graphite">
        Synthesizing score matrices & topic diagnostics...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1380px] mx-auto pb-12">
      
      {/* ── 1. ACADEMIC OS HEADER ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-quad/10 text-quad border border-quad/30">
              EVALUATION COMPLETE
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite uppercase">
              ATTEMPT LEDGER #{attemptId}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            Assessment Diagnostics Ledger
          </h1>
          <p className="font-sans text-xs text-graphite mt-0.5">
            {result?.quizTitle || 'Relational Normalization & BCNF Decomposition Assessment'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/ai/quiz/new')}
            className="px-3.5 py-1.5 rounded-md border border-border bg-paper hover:bg-secondary/40 font-mono text-xs font-semibold text-ink flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
          <button
            onClick={() => alert('Exporting PDF Gradebook Ledger...')}
            className="px-3.5 py-1.5 rounded-md bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Gradebook</span>
          </button>
        </div>
      </div>

      {/* ── 2. HONORS SCORECARD & PERFORMANCE METRICS ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Score & Percentile */}
        <div className="p-5 rounded-md border border-quad/40 bg-quad/10 space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase font-bold text-quad">
              OVERALL GRADE
            </span>
            <Award className="w-4 h-4 text-quad" />
          </div>
          <p className="font-mono text-3xl font-bold text-ink">
            {result?.score || 92}%
          </p>
          <p className="font-sans text-xs font-semibold text-quad">
            Top {100 - (result?.percentile || 96)}% Cohort Standing
          </p>
        </div>

        {/* Card 2: Accuracy & Counts */}
        <div className="p-5 rounded-md border border-border/80 bg-paper space-y-1.5 shadow-xs">
          <span className="font-mono text-[10px] uppercase font-bold text-graphite">
            ACCURACY BREAKDOWN
          </span>
          <p className="font-mono text-2xl font-bold text-ink">
            {result?.correctCount || 9} / {result?.totalQuestions || 10}
          </p>
          <p className="font-mono text-[11px] text-graphite">
            <span className="text-quad font-bold">✓ {result?.correctCount || 9} Correct</span> •{' '}
            <span className="text-destructive font-bold">✗ {result?.incorrectCount || 1} Error</span>
          </p>
        </div>

        {/* Card 3: Time Elapsed */}
        <div className="p-5 rounded-md border border-border/80 bg-paper space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase font-bold text-graphite">
              TIME ELAPSED
            </span>
            <Clock className="w-4 h-4 text-graphite" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">
            {Math.floor((result?.timeTakenSeconds || 684) / 60)}m {(result?.timeTakenSeconds || 684) % 60}s
          </p>
          <p className="font-mono text-[11px] text-graphite">
            Avg ~68s per question
          </p>
        </div>

        {/* Card 4: Cohort Rank */}
        <div className="p-5 rounded-md border border-border/80 bg-paper space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase font-bold text-graphite">
              COHORT RANKING
            </span>
            <TrendingUp className="w-4 h-4 text-chalk" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">
            Rank #{result?.rank || 3}
          </p>
          <p className="font-mono text-[11px] text-chalk font-semibold">
            Semester 5 DBMS Honor Roll
          </p>
        </div>

      </div>

      {/* ── 3. WEAK AREA TOPIC DIAGNOSTIC TABLE ────────────────────────── */}
      <div className="p-5 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div>
            <span className="font-mono text-[10px] font-bold text-graphite uppercase">
              TOPIC MASTERY & WEAKNESS DIAGNOSTICS
            </span>
            <h3 className="font-display text-base font-bold text-ink">
              Granular Syllabus Competency
            </h3>
          </div>
          <span className="font-mono text-[10px] text-quad font-bold">
            {result?.weakTopics?.length || 3} SUB-TOPICS ANALYZED
          </span>
        </div>

        {/* Topic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-border/60 font-mono text-[10px] text-graphite uppercase">
                <th className="py-2 pr-4 font-bold">SYLLABUS SUB-TOPIC</th>
                <th className="py-2 px-4 font-bold">QUESTIONS TESTED</th>
                <th className="py-2 px-4 font-bold">ACCURACY</th>
                <th className="py-2 px-4 font-bold">STATUS</th>
                <th className="py-2 pl-4 font-bold text-right">REMEDIATION ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-xs">
              {result?.weakTopics?.map((wt, idx) => (
                <tr key={idx} className="hover:bg-secondary/15">
                  <td className="py-3 pr-4 font-sans font-bold text-ink">{wt.topic}</td>
                  <td className="py-3 px-4 text-graphite">
                    {wt.correctCount} / {wt.totalQuestions} ({wt.totalQuestions} Qs)
                  </td>
                  <td className="py-3 px-4 font-bold text-ink">{wt.accuracyPercentage}%</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-[2px] text-[9px] uppercase font-bold border ${
                        wt.masteryStatus === 'mastered'
                          ? 'border-quad/30 bg-quad/10 text-quad'
                          : wt.masteryStatus === 'proficient'
                          ? 'border-chalk/30 bg-chalk/10 text-chalk'
                          : 'border-marker/40 bg-marker/20 text-ink'
                      }`}
                    >
                      {wt.masteryStatus === 'mastered'
                        ? 'Mastered'
                        : wt.masteryStatus === 'proficient'
                        ? 'Proficient'
                        : 'Needs Revision'}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    {wt.masteryStatus === 'needs_revision' ? (
                      <button
                        onClick={() => navigate('/ai/summarizer')}
                        className="px-2.5 py-1 rounded bg-quad/10 border border-quad/30 text-quad font-bold text-[10px] hover:bg-quad hover:text-paper transition-all"
                      >
                        ⚡ Generate Remediation Flashcards
                      </button>
                    ) : (
                      <span className="text-[10px] text-graphite">Ready for Finals</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. EXHAUSTIVE QUESTION REVIEW LEDGER ────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
            DETAILED QUESTION REVIEW & MODEL EXPLANATIONS ({result?.answers?.length || 0})
          </span>
        </div>

        <div className="space-y-3">
          {result?.answers?.map((ans, idx) => (
            <div
              key={ans.questionId}
              className={`p-5 rounded-md border bg-paper space-y-3 shadow-xs ${
                ans.isCorrect ? 'border-border/80' : 'border-destructive/40 bg-destructive/5'
              }`}
            >
              {/* Question Header */}
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                      ans.isCorrect
                        ? 'border-quad/30 bg-quad/10 text-quad'
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    }`}
                  >
                    {ans.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                  </span>
                  <span className="font-mono text-[10px] text-graphite">
                    Question {idx + 1} • {ans.topicTag || 'Core Topic'}
                  </span>
                </div>

                <span className="font-mono text-[9px] text-graphite">
                  {ans.citation || 'Course Syllabus Reference'}
                </span>
              </div>

              {/* Prompt Text */}
              <p className="font-sans text-sm font-bold text-ink leading-snug">
                {ans.prompt}
              </p>

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded bg-secondary/15 border border-border/60 space-y-0.5">
                  <span className="text-[10px] text-graphite uppercase font-bold">
                    YOUR RECORDED ANSWER:
                  </span>
                  <p className={`font-bold ${ans.isCorrect ? 'text-quad' : 'text-destructive'}`}>
                    {String(ans.selectedAnswer)}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-quad/10 border border-quad/30 space-y-0.5">
                  <span className="text-[10px] text-quad uppercase font-bold">
                    VERIFIED CORRECT KEY:
                  </span>
                  <p className="font-bold text-quad">
                    {String(ans.correctAnswer)}
                  </p>
                </div>
              </div>

              {/* Model Explanation */}
              {ans.explanation && (
                <div className="p-3 bg-secondary/10 rounded border border-border/60 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-graphite uppercase">
                    ACADEMIC MODEL JUSTIFICATION:
                  </span>
                  <p className="font-sans text-xs text-graphite leading-relaxed">
                    {ans.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default QuizResults;
