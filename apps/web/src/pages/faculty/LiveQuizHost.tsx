import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateLiveQuizSessionMutation } from '../../store/api/liveQuizApi';
import { Radio } from 'lucide-react';

export const LiveQuizHost: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [createSession, { isLoading }] = useCreateLiveQuizSessionMutation();

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    try {
      const res = await createSession({
        topic,
        questionCount,
      }).unwrap();
      if (res.data?.id) {
        navigate(`/live-quiz/play/${res.data.id}`);
      }
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Host a Live Classroom Quiz</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create an instant multiplayer quiz room. Students join via game PIN or QR code.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
        <form onSubmit={handleStartSession} className="space-y-4">
          <div>
            <label htmlFor="quizTopic" className="block text-sm font-medium mb-1.5">
              Quiz Topic / Subject
            </label>
            <input
              id="quizTopic"
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Rapid Fire: DBMS Indexing & B-Trees"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="questionsCount" className="block text-sm font-medium mb-1.5">
              Question Count
            </label>
            <select
              id="questionsCount"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={5}>5 Questions (5 mins)</option>
              <option value={10}>10 Questions (10 mins)</option>
              <option value={15}>15 Questions (15 mins)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
          >
            <Radio className="w-4 h-4" />
            {isLoading ? 'Creating Room...' : 'Launch Live Quiz Session'}
          </button>
        </form>
      </div>
    </div>
  );
};
