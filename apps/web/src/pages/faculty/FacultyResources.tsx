import React from 'react';
import { useGetFacultyResourcesQuery } from '../../store/api/facultyApi';
import { BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyResources: React.FC = () => {
  const { data, isLoading } = useGetFacultyResourcesQuery();
  const resources = data?.data || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Resources Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and organize official syllabus materials, lecture slides, and reference notes.
          </p>
        </div>

        <Link
          to="/resources/upload"
          className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Upload Material
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground col-span-2">Loading course resources...</div>
        ) : resources.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 space-y-2 col-span-2">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-medium">No resources uploaded yet</p>
          </div>
        ) : (
          resources.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {r.type}
                </span>
              </div>
              <h3 className="font-bold text-base">{r.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
