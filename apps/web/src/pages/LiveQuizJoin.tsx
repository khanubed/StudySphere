import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJoinLiveQuizByCodeMutation } from '../store/api/liveQuizApi';
import { Radio } from 'lucide-react';

export const LiveQuizJoin: React.FC = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [joinLiveQuiz, { isLoading }] = useJoinLiveQuizByCodeMutation();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      const res = await joinLiveQuiz({ joinCode }).unwrap();
      if (res.data?.id) {
        navigate(`/live-quiz/play/${res.data.id}`);
      }
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Radio className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Join Live Quiz</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit game code shared by your instructor to compete on the live leaderboard.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="joinCode" className="block text-xs font-medium uppercase text-muted-foreground mb-1.5 text-center">
              Session Code
            </label>
            <input
              id="joinCode"
              type="text"
              required
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. 849201"
              className="w-full text-center tracking-widest text-2xl font-black py-3 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || joinCode.length < 4}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Joining Session...' : 'Enter Live Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};
