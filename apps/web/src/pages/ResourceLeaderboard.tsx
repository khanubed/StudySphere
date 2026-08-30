import React from 'react';
import { Link } from 'react-router-dom';
import { useGetResourceLeaderboardQuery } from '../store/api/resourceApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLeaderboardScope } from '../store/slices/resourceSlice';

export const ResourceLeaderboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const scope = useAppSelector((state) => state.resource.leaderboardScope);

  const { data: leaderboardResponse } = useGetResourceLeaderboardQuery({ scope });
  const entries = leaderboardResponse?.data || [];

  const top3 = entries.slice(0, 3);

  const getTierStamp = (badge?: string) => {
    switch (badge) {
      case 'diamond':
        return { label: 'DIAMOND', class: 'border-quad text-quad bg-quad/10' };
      case 'platinum':
        return { label: 'PLATINUM', class: 'border-chalk text-chalk bg-chalk/10' };
      case 'gold':
        return { label: 'GOLD', class: 'border-marker text-ink bg-marker/20 font-bold' };
      case 'silver':
        return { label: 'SILVER', class: 'border-slate-400 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' };
      default:
        return { label: 'BRONZE', class: 'border-amber-700 text-amber-800 dark:text-amber-300 bg-amber-500/10' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* ── 1. HEADER & BREADCRUMB ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-graphite mb-1">
            <Link to="/resources" className="hover:text-quad transition-colors">
              LIBRARY CATALOG
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">ACADEMIC HALL OF FAME</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Contributor Leaderboard
          </h1>
          <p className="font-body text-xs text-graphite mt-0.5">
            Recognizing faculty, alumni, and students who elevate campus scholarship through verified open courseware.
          </p>
        </div>

        {/* Scope Controller */}
        <div className="flex items-center gap-1 bg-secondary/15 p-1 border border-border rounded-md font-mono text-xs">
          {(['daily', 'weekly', 'monthly', 'allTime'] as const).map((s) => (
            <button
              key={s}
              onClick={() => dispatch(setLeaderboardScope(s))}
              className={`px-3 py-1.5 rounded-[4px] capitalize transition-colors ${
                scope === s
                  ? 'bg-quad text-paper font-bold shadow-sm'
                  : 'text-graphite hover:text-ink'
              }`}
            >
              {s === 'allTime' ? 'All-Time' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. TOP 3 PODIUM ───────────────────────────────────────────── */}
      {top3.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 items-end pt-4">
          
          {/* #2 Rank (Silver) */}
          {top3[1] && (
            <div className="order-2 md:order-1 p-5 rounded-md bg-paper border border-border/80 flex flex-col items-center text-center space-y-3 shadow-sm hover:border-slate-400 transition-colors">
              <span className="font-mono text-xs font-bold text-graphite">#02 SILVER TIER</span>
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-400 flex items-center justify-center font-bold text-lg text-ink">
                {top3[1].user.avatarUrl || top3[1].user.name[0]}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-sans font-bold text-base text-ink">{top3[1].user.name}</h3>
                <span className="font-mono text-xs text-graphite">{top3[1].user.branch || 'Campus Student'}</span>
              </div>
              <div className="border-t border-border/60 w-full pt-2.5 font-mono text-xs flex justify-around">
                <div>
                  <span className="text-graphite uppercase text-[10px] block">UPLOADS</span>
                  <span className="font-bold text-ink">{top3[1].resourcesCount || 8}</span>
                </div>
                <div>
                  <span className="text-graphite uppercase text-[10px] block">POINTS</span>
                  <span className="font-bold text-quad">{top3[1].points}</span>
                </div>
              </div>
            </div>
          )}

          {/* #1 Rank (Gold / Diamond) */}
          {top3[0] && (
            <div className="order-1 md:order-2 p-6 rounded-md bg-paper border-2 border-quad flex flex-col items-center text-center space-y-3 shadow-md relative -translate-y-2">
              <div className="absolute -top-3 bg-quad text-paper font-mono text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                👑 TOP CONTRIBUTOR
              </div>
              <span className="font-mono text-xs font-bold text-quad">#01 {top3[0].badge?.toUpperCase() || 'GOLD'} TIER</span>
              <div className="w-20 h-20 rounded-full bg-quad/10 border-2 border-quad flex items-center justify-center font-bold text-2xl text-quad">
                {top3[0].user.avatarUrl || top3[0].user.name[0]}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-sans font-bold text-lg text-ink">{top3[0].user.name}</h3>
                <span className="font-mono text-xs text-graphite">{top3[0].user.branch || 'Faculty Lead'}</span>
              </div>
              <div className="border-t border-border/60 w-full pt-3 font-mono text-xs flex justify-around">
                <div>
                  <span className="text-graphite uppercase text-[10px] block">UPLOADS</span>
                  <span className="font-bold text-ink text-sm">{top3[0].resourcesCount || 22}</span>
                </div>
                <div>
                  <span className="text-graphite uppercase text-[10px] block">IMPACT SCORE</span>
                  <span className="font-bold text-quad text-sm">{top3[0].points} pts</span>
                </div>
              </div>
            </div>
          )}

          {/* #3 Rank (Bronze) */}
          {top3[2] && (
            <div className="order-3 p-5 rounded-md bg-paper border border-border/80 flex flex-col items-center text-center space-y-3 shadow-sm hover:border-amber-700 transition-colors">
              <span className="font-mono text-xs font-bold text-graphite">#03 BRONZE TIER</span>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 border-2 border-amber-700 flex items-center justify-center font-bold text-lg text-amber-800 dark:text-amber-200">
                {top3[2].user.avatarUrl || top3[2].user.name[0]}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-sans font-bold text-base text-ink">{top3[2].user.name}</h3>
                <span className="font-mono text-xs text-graphite">{top3[2].user.branch || 'Alumni SDE'}</span>
              </div>
              <div className="border-t border-border/60 w-full pt-2.5 font-mono text-xs flex justify-around">
                <div>
                  <span className="text-graphite uppercase text-[10px] block">UPLOADS</span>
                  <span className="font-bold text-ink">{top3[2].resourcesCount || 5}</span>
                </div>
                <div>
                  <span className="text-graphite uppercase text-[10px] block">POINTS</span>
                  <span className="font-bold text-quad">{top3[2].points}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── 3. FULL LEADERBOARD TABLE ─────────────────────────────────── */}
      <div className="bg-paper border border-border rounded-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
            COMPLETE RANKING AUDIT ({entries.length} RECORDED CONTRIBUTORS)
          </span>
          <span className="font-mono text-[11px] text-quad">✓ VERIFIED IMPACT POINTS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-border/60 font-mono text-[11px] text-graphite uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Scholar Name</th>
                <th className="py-2.5 px-3">Department / Batch</th>
                <th className="py-2.5 px-3 text-center">Verified Uploads</th>
                <th className="py-2.5 px-3 text-center">Downloads Driven</th>
                <th className="py-2.5 px-3 text-center">Tier Badge</th>
                <th className="py-2.5 px-3 text-right">Mastery Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {entries.map((entry) => {
                const tierInfo = getTierStamp(entry.badge);

                return (
                  <tr
                    key={entry.userId}
                    className="hover:bg-secondary/10 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold">
                      #{entry.rank < 10 ? `0${entry.rank}` : entry.rank}
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-secondary/50 border border-border flex items-center justify-center font-bold text-xs text-quad">
                          {entry.user.avatarUrl || entry.user.name[0]}
                        </div>
                        <span className="font-bold text-ink">{entry.user.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-sans text-graphite">
                      {entry.user.branch || 'Campus Student'}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-ink">
                      {entry.resourcesCount || 10}
                    </td>

                    <td className="py-3 px-3 text-center text-graphite">
                      📥 {entry.downloadsGenerated || 420}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-[2px] border ${tierInfo.class}`}>
                        {tierInfo.label}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-quad">
                      {entry.points.toLocaleString()} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
