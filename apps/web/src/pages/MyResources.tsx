import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderArchive,
  PlusCircle,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useGetMyResourcesQuery } from '../store/api/resourceApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setMyResourcesTab } from '../store/slices/resourceSlice';
import { ResourceStatus } from '@studysphere/shared-types';

export const MyResources: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.resource.myResourcesTab);

  const { data: myResourcesResponse, isLoading } = useGetMyResourcesQuery({
    status: activeTab,
  });

  const resources = myResourcesResponse?.data || [];

  const getStatusBadge = (status: ResourceStatus) => {
    switch (status) {
      case 'published':
        return { label: '✓ PUBLISHED', class: 'bg-quad/10 text-quad border-quad/40' };
      case 'pending':
        return { label: '⌛ PENDING FACULTY REVIEW', class: 'bg-marker/15 text-ink border-marker/50 font-bold' };
      case 'changes_requested':
        return { label: '⚠️ CHANGES REQUESTED', class: 'bg-marker/20 text-destructive border-destructive/40 font-bold' };
      case 'rejected':
        return { label: '✗ REJECTED', class: 'bg-destructive/10 text-destructive border-destructive/30' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* ── 1. HEADER & ACTIONS ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-graphite mb-1">
            <Link to="/resources" className="hover:text-quad transition-colors">
              LIBRARY CATALOG
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">MY SUBMISSIONS</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">My Academic Contributions</h1>
          <p className="font-body text-xs text-graphite mt-0.5">
            Manage your shared courseware, monitor faculty verification standing, and update Drive links.
          </p>
        </div>

        <button
          onClick={() => navigate('/resources/upload')}
          className="font-mono text-xs font-bold px-4 py-2.5 rounded-md bg-quad text-paper hover:bg-quad/90 flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Resource</span>
        </button>
      </div>

      {/* ── 2. SUMMARY METRICS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-paper border border-border/80 rounded-md">
          <span className="font-mono text-[10px] uppercase text-graphite block">TOTAL SUBMISSIONS</span>
          <span className="font-mono text-2xl font-bold text-ink">8</span>
          <span className="font-mono text-[10px] text-quad block mt-1">✓ 6 Live in Catalog</span>
        </div>
        <div className="p-4 bg-paper border border-border/80 rounded-md">
          <span className="font-mono text-[10px] uppercase text-graphite block">PEER DOWNLOADS</span>
          <span className="font-mono text-2xl font-bold text-ink">840</span>
          <span className="font-mono text-[10px] text-quad block mt-1">+120 this week</span>
        </div>
        <div className="p-4 bg-paper border border-border/80 rounded-md">
          <span className="font-mono text-[10px] uppercase text-graphite block">EARNED POINTS</span>
          <span className="font-mono text-2xl font-bold text-quad">480 pts</span>
          <span className="font-mono text-[10px] text-graphite block mt-1">Silver Contributor</span>
        </div>
        <div className="p-4 bg-paper border border-border/80 rounded-md">
          <span className="font-mono text-[10px] uppercase text-graphite block">PENDING / ACTION</span>
          <span className="font-mono text-2xl font-bold text-marker">2</span>
          <span className="font-mono text-[10px] text-destructive block mt-1">1 Needs Attention</span>
        </div>
      </div>

      {/* ── 3. STATUS STEPPER TAB CONTROLLER ──────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 bg-secondary/15 p-1 border border-border rounded-md font-mono text-xs">
        {[
          { id: 'all', label: 'All Submissions' },
          { id: 'published', label: 'Published (6)' },
          { id: 'pending', label: 'Under Review (1)' },
          { id: 'changes_requested', label: 'Changes Requested (1)' },
          { id: 'rejected', label: 'Rejected (0)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setMyResourcesTab(tab.id as any))}
            className={`px-3 py-1.5 rounded-[4px] transition-colors ${
              activeTab === tab.id
                ? 'bg-quad text-paper font-bold shadow-sm'
                : 'text-graphite hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 4. RESOURCE SUBMISSIONS LIST ──────────────────────────────── */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-paper border border-border/60 rounded-md animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-md bg-paper space-y-3">
            <FolderArchive className="w-10 h-10 text-graphite mx-auto opacity-50" />
            <h3 className="font-display font-bold text-lg text-ink">No Submissions Found</h3>
            <p className="font-sans text-xs text-graphite">
              There are no documents matching this status category.
            </p>
          </div>
        ) : (
          resources.map((res) => {
            const statusInfo = getStatusBadge(res.status);

            return (
              <div
                key={res.id}
                className="p-5 bg-paper border border-border rounded-md space-y-3 hover:border-graphite transition-colors shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-secondary/30 text-ink border border-border">
                        {res.type.toUpperCase()}
                      </span>
                      <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] border ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                      <span className="font-mono text-[10px] text-graphite">
                        Semester {res.semester || 5} · {res.subjectId}
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-ink">
                      {res.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
                    <a
                      href={res.driveLink || res.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md border border-border hover:border-quad text-ink flex items-center gap-1 transition-colors"
                    >
                      <span>Drive Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Moderator Feedback Alert Box (if changes requested or rejected) */}
                {res.moderationFeedback && (
                  <div className="p-3 bg-marker/15 border border-marker/60 rounded-md font-mono text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-ink font-bold">
                      <AlertTriangle className="w-4 h-4 text-marker" />
                      <span>FACULTY COMMITTEE AUDIT NOTE</span>
                    </div>
                    <p className="font-sans text-xs text-ink leading-relaxed">
                      "{res.moderationFeedback}"
                    </p>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => navigate('/resources/upload')}
                        className="px-3 py-1 rounded-[4px] bg-quad text-paper font-bold text-[11px] hover:bg-quad/90"
                      >
                        Edit & Resubmit
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Metrics */}
                <div className="border-t border-border/60 pt-2 flex items-center justify-between font-mono text-[11px] text-graphite">
                  <span>Submitted: {new Date(res.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-4">
                    <span>📥 {res.downloadsCount || 0} Downloads</span>
                    <span>★ {res.bookmarksCount || 0} Bookmarks</span>
                    <span>💬 {res.commentsCount || 0} Comments</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
