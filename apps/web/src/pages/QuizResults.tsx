import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetQuizAttemptResultQuery } from '../store/api/quizApi';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

export const QuizResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId') || '';
  const { data, isLoading } = useGetQuizAttemptResultQuery(attemptId, {
    skip: !attemptId,
  });

  const result = data?.data;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Calculating scores and analytics...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score Summary Card */}
      <div className="p-8 rounded-3xl border border-border bg-card text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Quiz Complete!</h1>
        <p className="text-muted-foreground text-sm">Here is a breakdown of your performance</p>

        <div className="flex justify-center items-baseline gap-2 pt-2">
          <span className="text-5xl font-black text-primary">{result?.score || 0}</span>
          <span className="text-xl text-muted-foreground">/ {result?.maxScore || 100}</span>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-sm"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/ai/quiz/new"
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
          >
            Try Another Quiz
          </Link>
        </div>
      </div>

      {/* Answer feedback breakdown */}
      {result?.feedback && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Question Feedback & Explanations</h3>
          <div className="space-y-3">
            {result.feedback.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border bg-card space-y-2 ${
                  item.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <span className="font-semibold text-sm">Question {idx + 1}</span>
                </div>
                <p className="text-xs text-muted-foreground">Correct Answer: {String(item.correctAnswer)}</p>
                {item.explanation && (
                  <p className="text-xs text-foreground/90 bg-muted/40 p-2.5 rounded-lg border border-border">
                    {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
