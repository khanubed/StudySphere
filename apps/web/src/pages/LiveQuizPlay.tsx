import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetLiveQuizSessionQuery } from '../store/api/liveQuizApi';
import { Radio, Users, Award } from 'lucide-react';

export const LiveQuizPlay: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, isLoading } = useGetLiveQuizSessionQuery(sessionId || '', {
    skip: !sessionId,
  });

  const session = data?.data;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Connecting to Live Quiz room...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between p-6 rounded-2xl border border-border bg-card shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 uppercase px-2 py-0.5 rounded-full bg-rose-500/10 animate-pulse">
              <Radio className="w-3.5 h-3.5" /> Live
            </span>
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Code: {session?.joinCode}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{session?.topic || 'Interactive Quiz Session'}</h1>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>{session?.participants?.length || 1} Participants</span>
        </div>
      </div>

      <div className="p-12 text-center border border-dashed border-border rounded-3xl bg-card space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Waiting for host to start next question...</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Keep this window active. Real-time questions and live leaderboard updates will stream automatically over WebSockets.
        </p>
      </div>
    </div>
  );
};
