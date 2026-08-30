import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuizByIdQuery, useSubmitQuizAttemptMutation } from '../store/api/quizApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setAnswer, toggleMarkForReview } from '../store/slices/quizSlice';
import { Timer, CheckCircle, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';

export const QuizAttempt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetQuizByIdQuery(id || '');
  const [submitQuizAttempt, { isLoading: isSubmitting }] = useSubmitQuizAttemptMutation();
  const { answers, markedForReview } = useSelector((state: RootState) => state.quiz);
  const [currentIdx, setCurrentIdx] = useState(0);

  const quiz = data?.data;
  const questions = quiz?.questions || [];
  const currentQ = questions[currentIdx];

  const handleSelectOption = (optText: string) => {
    if (!currentQ) return;
    dispatch(setAnswer({ questionId: currentQ.id, answer: optText }));
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      const res = await submitQuizAttempt({
        quizId: id,
        answers,
      }).unwrap();
      navigate(`/quiz/${id}/results?attemptId=${res.data?.attemptId}`);
    } catch {
      // Handled
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading quiz questions...</div>;
  }

  if (!quiz || questions.length === 0) {
    return <div className="p-8 text-center">Quiz has no questions available.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top quiz bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
        <div>
          <h2 className="font-bold text-lg">{quiz.title || 'Practice Quiz'}</h2>
          <span className="text-xs text-muted-foreground">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Timer className="w-4 h-4" />
          <span>Timer Active</span>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground leading-snug">
              {currentIdx + 1}. {currentQ.prompt}
            </h3>
            <button
              onClick={() => dispatch(toggleMarkForReview(currentQ.id))}
              className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1 shrink-0 ${
                markedForReview.includes(currentQ.id)
                  ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentQ.options?.map((opt, oIdx) => {
              const optText = typeof opt === 'string' ? opt : opt.text;
              const isSelected = answers[currentQ.id] === optText;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(optText)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border hover:bg-muted/60 text-foreground'
                  }`}
                >
                  <span>{optText}</span>
                  {isSelected && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:opacity-90 shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Finish & Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
