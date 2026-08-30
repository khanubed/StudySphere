import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetQuizHistoryQuery } from '../store/api/quizApi';
import { Search } from 'lucide-react';

export const AIQuizHistory: React.FC = () => {
  const navigate = useNavigate();
  const { data: historyResponse } = useGetQuizHistoryQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const attempts = historyResponse?.data || [];

  const filtered = attempts.filter((att) =>
    att.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1380px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-chalk/10 text-chalk border border-chalk/30">
              AUDIT LOG
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite uppercase">
              STUDENT EXAMINATION ARCHIVE
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            Assessment History Ledger
          </h1>
          <p className="font-sans text-xs text-graphite mt-0.5">
            Complete record of past quiz attempts, accuracy rates, and completion times.
          </p>
        </div>

        <button
          onClick={() => navigate('/ai/quiz/new')}
          className="px-4 py-2 rounded bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase shadow-xs"
        >
          + Generate New Quiz
        </button>
      </div>

      {/* Table Card */}
      <div className="p-5 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-graphite absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assessment ledger..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-border bg-secondary/10 text-ink focus:outline-none focus:border-chalk"
            />
          </div>
          <span className="font-mono text-xs text-graphite">
            {filtered.length} Assessments Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-border/60 font-mono text-[10px] text-graphite uppercase">
                <th className="py-2.5 pr-4 font-bold">ATTEMPT ID</th>
                <th className="py-2.5 px-4 font-bold">DATE & TIME</th>
                <th className="py-2.5 px-4 font-bold">SCORE</th>
                <th className="py-2.5 px-4 font-bold">ACCURACY</th>
                <th className="py-2.5 px-4 font-bold">TIME ELAPSED</th>
                <th className="py-2.5 pl-4 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-xs">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-secondary/15">
                  <td className="py-3.5 pr-4 font-bold text-ink">{att.id}</td>
                  <td className="py-3.5 px-4 text-graphite">
                    {new Date(att.startedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-quad">{att.score}%</td>
                  <td className="py-3.5 px-4 text-ink">{att.accuracy}%</td>
                  <td className="py-3.5 px-4 text-graphite">
                    {Math.floor((att.timeTakenSeconds || 680) / 60)}m {(att.timeTakenSeconds || 680) % 60}s
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <button
                      onClick={() => navigate(`/quiz/${att.quizId}/results?attemptId=${att.id}`)}
                      className="px-2.5 py-1 rounded bg-quad/10 border border-quad/30 text-quad font-bold text-[11px] hover:bg-quad hover:text-paper transition-all"
                    >
                      View Diagnostics →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIQuizHistory;
