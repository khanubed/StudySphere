import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuizByIdQuery, useSubmitQuizAttemptMutation } from '../store/api/quizApi';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  setAnswer,
  toggleMarkForReview,
  setCurrentQuestionIndex,
  nextQuestion,
  prevQuestion,
} from '../store/slices/quizSlice';
import {
  Clock,
  Flag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';


export const QuizAttempt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: quizResponse, isLoading } = useGetQuizByIdQuery(id || 'quiz-001');
  const [submitQuizAttempt, { isLoading: isSubmitting }] = useSubmitQuizAttemptMutation();

  const { currentQuestionIndex, answers, markedForReview } = useAppSelector(
    (state) => state.quiz
  );

  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 mins
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const quiz = quizResponse?.data;
  const questions = quiz?.questions || [];
  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Server Countdown Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optText: string) => {
    if (!currentQ) return;
    dispatch(setAnswer({ questionId: currentQ.id, answer: optText }));
  };

  const handleTextAnswerChange = (val: string) => {
    if (!currentQ) return;
    dispatch(setAnswer({ questionId: currentQ.id, answer: val }));
  };

  const handleSubmitFinal = async () => {
    if (!id) return;
    try {
      await submitQuizAttempt({
        quizId: id,
        answers,
        timeSpentSeconds: 15 * 60 - timeLeft,
      }).unwrap();

      navigate(`/quiz/${id}/results`);
    } catch {
      navigate(`/quiz/${id}/results`);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = markedForReview.length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  if (isLoading) {
    return (
      <div className="p-12 text-center font-mono text-sm text-graphite">
        Initializing secure exam hall session...
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-12 text-center font-mono text-sm text-graphite">
        No assessment questions available.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto pb-12">
      
      {/* ── 1. TOP ASSESSMENT STATUS BAR ───────────────────────────────── */}
      <div className="p-3.5 rounded-md border border-border/80 bg-paper flex flex-col sm:flex-row justify-between items-center gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase font-bold text-quad bg-quad/10 px-2 py-0.5 rounded border border-quad/30">
            ACTIVE ASSESSMENT
          </span>
          <h2 className="font-sans text-sm font-bold text-ink">
            {quiz.title}
          </h2>
          <span className="font-mono text-xs text-graphite">
            • Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Server-authoritative timer */}
          <div
            className={`px-3 py-1 rounded font-mono text-xs font-bold flex items-center gap-1.5 border ${
              timeLeft < 120
                ? 'border-destructive bg-destructive/10 text-destructive animate-pulse'
                : timeLeft < 300
                ? 'border-marker bg-marker/20 text-ink'
                : 'border-border bg-secondary/20 text-ink'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-1 bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase rounded shadow-xs transition-all"
          >
            Submit Assessment
          </button>
        </div>
      </div>

      {/* ── 2. THREE-PANEL ASSESSMENT WORKSPACE ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── PANEL 1: QUESTION NAVIGATOR GRID (2.5 Cols) ──────────────── */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                QUESTION NAVIGATOR
              </span>
              <span className="font-mono text-[10px] text-quad font-bold">
                {answeredCount} / {questions.length} DONE
              </span>
            </div>

            {/* Grid Matrix (4 cols) */}
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = markedForReview.includes(q.id);
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => dispatch(setCurrentQuestionIndex(idx))}
                    className={`h-10 rounded-[3px] font-mono text-xs font-bold flex items-center justify-center border transition-all ${
                      isCurrent
                        ? 'border-chalk bg-chalk/15 text-chalk ring-2 ring-chalk/30 shadow-xs'
                        : isFlagged
                        ? 'border-marker bg-marker/20 text-ink'
                        : isAnswered
                        ? 'border-quad/60 bg-quad/10 text-quad'
                        : 'border-border bg-secondary/15 text-graphite hover:bg-secondary/30'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged ? (
                      <span className="text-[9px] ml-0.5">⚑</span>
                    ) : isAnswered ? (
                      <span className="text-[9px] ml-0.5">✓</span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Matrix Legend */}
            <div className="p-2.5 bg-secondary/15 rounded border border-border/40 font-mono text-[10px] space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-chalk" />
                <span className="text-graphite">Current Active Question</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-quad" />
                <span className="text-graphite">Answered & Recorded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-marker" />
                <span className="text-graphite">Flagged for Revision (⚑)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── PANEL 2: QUESTION CARD SURFACE (6.5 Cols) ────────────────── */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-6 rounded-md border border-border/80 bg-paper space-y-5 shadow-xs min-h-[500px] flex flex-col justify-between">
            {currentQ && (
              <div className="space-y-4">
                
                {/* Question Header & Flag Action */}
                <div className="flex justify-between items-center pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-secondary/30 border border-border text-ink">
                      {currentQ.type.toUpperCase()}
                    </span>
                    <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-quad/10 border border-quad/30 text-quad">
                      {currentQ.marks || 2} MARKS
                    </span>
                    <span className="font-mono text-[10px] text-graphite">
                      {currentQ.topicTag || 'Core Topic'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch(toggleMarkForReview(currentQ.id))}
                    className={`px-2 py-1 rounded font-mono text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                      markedForReview.includes(currentQ.id)
                        ? 'border-marker bg-marker/20 text-ink'
                        : 'border-border bg-paper text-graphite hover:text-ink'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{markedForReview.includes(currentQ.id) ? 'Flagged (F)' : 'Flag for Review (F)'}</span>
                  </button>
                </div>

                {/* Question Prompt Text */}
                <div className="py-2">
                  <h3 className="font-sans text-base font-bold text-ink leading-relaxed">
                    {currentQuestionIndex + 1}. {currentQ.prompt}
                  </h3>
                </div>

                {/* Input Modes: MCQ / True-False / Fill Blank / Short Answer */}
                {currentQ.type === 'mcq' || currentQ.type === 'true_false' ? (
                  <div className="space-y-2 pt-2">
                    {currentQ.options?.map((opt: any, oIdx: number) => {
                      const optText = typeof opt === 'string' ? opt : opt.text;
                      const isSelected = answers[currentQ.id] === optText;

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(optText)}
                          className={`w-full text-left p-3.5 rounded-[4px] border font-sans text-xs flex items-center justify-between transition-all ${
                            isSelected
                              ? 'border-quad bg-quad/10 text-ink font-bold shadow-xs'
                              : 'border-border bg-paper hover:bg-secondary/15 text-ink'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 pr-2">
                            <span className="font-mono text-xs font-bold text-graphite">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{optText}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-quad shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : currentQ.type === 'fill_blank' ? (
                  <div className="pt-2 space-y-2">
                    <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                      TYPE MISSING KEYWORD / TERM:
                    </label>
                    <input
                      type="text"
                      value={typeof answers[currentQ.id] === 'string' ? (answers[currentQ.id] as string) : ''}
                      onChange={(e) => handleTextAnswerChange(e.target.value)}
                      placeholder="e.g. trivial"
                      className="w-full p-3 font-mono text-xs rounded border border-border bg-secondary/10 text-ink focus:outline-none focus:border-quad"
                    />
                  </div>
                ) : (
                  <div className="pt-2 space-y-2">
                    <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                      STRUCTURED RESPONSE (SHORT ANSWER):
                    </label>
                    <textarea
                      rows={4}
                      value={typeof answers[currentQ.id] === 'string' ? (answers[currentQ.id] as string) : ''}
                      onChange={(e) => handleTextAnswerChange(e.target.value)}
                      placeholder="Provide concise conceptual answer..."
                      className="w-full p-3 font-sans text-xs rounded border border-border bg-secondary/10 text-ink focus:outline-none focus:border-quad resize-none leading-relaxed"
                    />
                  </div>
                )}


              </div>
            )}

            {/* Bottom Question Controls */}
            <div className="pt-4 border-t border-border/60 flex justify-between items-center">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => dispatch(prevQuestion())}
                className="px-3 py-1.5 rounded border border-border bg-paper hover:bg-secondary/20 font-mono text-xs font-semibold text-ink flex items-center gap-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <button
                type="button"
                disabled={currentQuestionIndex >= questions.length - 1}
                onClick={() => dispatch(nextQuestion())}
                className="px-4 py-1.5 rounded bg-quad hover:bg-quad/90 font-mono text-xs font-bold text-paper flex items-center gap-1.5 disabled:opacity-40"
              >
                Save & Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* ── PANEL 3: ASSESSMENT STATUS & CONTROLS (3 Cols) ───────────── */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                STATUS AUDIT
              </span>
              <span className="font-mono text-[10px] text-chalk font-bold">LIVE METRICS</span>
            </div>

            {/* Progress */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-graphite">Completion:</span>
                <span className="font-bold text-ink">
                  {Math.round((answeredCount / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded bg-secondary/30 overflow-hidden border border-border/60">
                <div
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  className="h-full bg-quad"
                />
              </div>
            </div>

            {/* Breakdown List */}
            <div className="p-3 bg-secondary/15 rounded border border-border/60 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-graphite">Answered:</span>
                <span className="font-bold text-quad">{answeredCount} Qs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Flagged for Review:</span>
                <span className="font-bold text-marker">{flaggedCount} Qs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Unanswered:</span>
                <span className="font-bold text-graphite">{unansweredCount} Qs</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-2.5 px-4 bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase rounded shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-paper" />
              <span>Finalize & Submit</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── 3. SUBMIT AUDIT MODAL ──────────────────────────────────────── */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-paper rounded-lg border border-border p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <h3 className="font-display text-lg font-bold text-ink">
                Submit Assessment?
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded hover:bg-secondary/40 text-graphite"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="font-mono text-xs space-y-2 p-3 bg-secondary/15 rounded border border-border/60">
              <div className="flex justify-between">
                <span className="text-graphite">Total Questions:</span>
                <span className="font-bold text-ink">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Answered:</span>
                <span className="font-bold text-quad">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Flagged (Unresolved):</span>
                <span className="font-bold text-marker">{flaggedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite">Unanswered:</span>
                <span className="font-bold text-destructive">{unansweredCount}</span>
              </div>
            </div>

            <p className="font-sans text-xs text-graphite leading-relaxed">
              Once submitted, your answers will be finalized and evaluated by the automated grading engine.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2 rounded border border-border bg-paper font-mono text-xs font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitFinal}
                className="flex-1 py-2 rounded bg-quad font-mono text-xs font-bold text-paper"
              >
                {isSubmitting ? 'Grading...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizAttempt;
