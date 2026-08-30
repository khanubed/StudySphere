import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAlumniListQuery } from '../store/api/alumniApi';
import { Users, Building, ShieldCheck, ArrowRight } from 'lucide-react';

export const AlumniDirectory: React.FC = () => {
  const { data, isLoading } = useGetAlumniListQuery();
  const alumni = data?.data?.items || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Network & Mentorship</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with graduated seniors working at top organizations and request career mentorship.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground col-span-2">Loading alumni directory...</div>
        ) : alumni.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 space-y-2 col-span-2">
            <Users className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-medium">No alumni profiles found</p>
          </div>
        ) : (
          alumni.map((alum) => (
            <div
              key={alum.id}
              className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {alum.name[0]}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base truncate">{alum.name}</h3>
                    {alum.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {alum.designation || 'Engineer'} at {alum.currentCompany || 'Tech Company'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Class of {alum.graduationYear}
                  </p>
                </div>
              </div>

              {alum.skills && alum.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                  {alum.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <Link
                to={`/alumni/${alum.id}`}
                className="w-full text-center py-2 px-4 rounded-xl border border-border hover:bg-muted/80 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                View Profile & Connect <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
