import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerateQuizAIMutation } from '../store/api/aiApi';
import { Sparkles } from 'lucide-react';

export const AIQuizNew: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [notesContent, setNotesContent] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [generateQuiz, { isLoading }] = useGenerateQuizAIMutation();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await generateQuiz({
        topic,
        notesContent: notesContent || undefined,
        questionCount,
        difficulty,
      }).unwrap();

      if (res.data?.quizId) {
        navigate(`/quiz/${res.data.quizId}/attempt`);
      }
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Quiz Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Instant customized self-tests with automated scoring, explanations, and weakness analysis.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-1.5">
              Quiz Topic / Subject Area
            </label>
            <input
              id="topic"
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Operating Systems: Process Scheduling & Deadlocks"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label htmlFor="sourceNotes" className="block text-sm font-medium mb-1.5">
              Source Material / Notes (Optional)
            </label>
            <textarea
              id="sourceNotes"
              rows={4}
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              placeholder="Paste specific lecture notes if you want the quiz generated directly from your material..."
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="questionCount" className="block text-sm font-medium mb-1.5">
                Number of Questions
              </label>
              <select
                id="questionCount"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-1.5">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="easy">Easy (Fundamentals)</option>
                <option value="medium">Medium (Standard Exam)</option>
                <option value="hard">Hard (Advanced / GATE)</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Generating Questions...' : 'Create & Start Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
