import React from 'react';
import { Link } from 'react-router-dom';
import { useGetCodingTracksQuery } from '../store/api/codingHubApi';
import { Terminal, ChevronRight } from 'lucide-react';
import { CodingTrack } from '@studysphere/shared-types';

export const CodingHub: React.FC = () => {
  const { data } = useGetCodingTracksQuery();
  const tracks: (CodingTrack | { id: string; name: string; description: string; slug: string; problemsCount: number })[] =
    data?.data || [
      {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        description: 'Blind 75, Striver A2Z, and LeetCode patterns for placement exams.',
        slug: 'dsa',
        problemsCount: 75,
        createdAt: '',
      },
      {
        id: 'web-dev',
        name: 'Full Stack Web Development',
        description: 'React, Node.js, System Design, and REST API architecture challenges.',
        slug: 'web-dev',
        problemsCount: 45,
        createdAt: '',
      },
      {
        id: 'core-cs',
        name: 'Core CS Fundamentals',
        description: 'OS, DBMS, Computer Networks, and OOP interview preparation.',
        slug: 'core-cs',
        problemsCount: 50,
        createdAt: '',
      },
    ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coding Hub & DSA Practice</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Master company-targeted coding sheets, core CS fundamentals, and receive instant AI code review.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/50 transition-all"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{track.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{track.description}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Problems</span>
                <span className="font-semibold text-foreground">{track.problemsCount || 50}</span>
              </div>

              <Link
                to={`/coding/${track.slug}/arrays/two-sum`}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
              >
                Start Practice <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
