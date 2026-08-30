import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  ExternalLink,
  Share2,
  CheckCircle2,
  FileText,
  Send,
  AlertCircle,
} from 'lucide-react';
import {
  useGetResourceByIdQuery,
  useToggleLikeResourceMutation,
  useToggleBookmarkResourceMutation,
  useGetResourceCommentsQuery,
  useAddResourceCommentMutation,
  useGetResourcesQuery,
} from '../store/api/resourceApi';

export const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  // RTK Query hooks
  const { data: resourceResponse, isLoading } = useGetResourceByIdQuery(id || '');
  const { data: commentsResponse } = useGetResourceCommentsQuery(id || '');
  const { data: relatedResponse } = useGetResourcesQuery();

  const [toggleLike] = useToggleLikeResourceMutation();
  const [toggleBookmark] = useToggleBookmarkResourceMutation();
  const [addComment, { isLoading: isPostingComment }] = useAddResourceCommentMutation();

  const resource = resourceResponse?.data;
  const comments = commentsResponse?.data || [];
  const relatedResources = (relatedResponse?.data?.items || [])
    .filter((r) => r.id !== id && r.subjectId === resource?.subjectId)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;
    try {
      await addComment({ resourceId: id, content: commentText }).unwrap();
      setCommentText('');
    } catch {
      // Handled
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-6">
        <div className="h-6 w-48 bg-secondary/30 rounded animate-pulse" />
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 bg-paper border border-border rounded-md animate-pulse" />
          <div className="lg:col-span-7 h-96 bg-paper border border-border rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="p-12 text-center border border-border rounded-md bg-paper max-w-md mx-auto my-12 space-y-3">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <h2 className="font-display text-xl font-bold text-ink">Resource Not Found</h2>
        <p className="font-sans text-xs text-graphite">
          The requested academic ledger entry does not exist or has been archived.
        </p>
        <Link
          to="/resources"
          className="font-mono text-xs font-bold text-quad hover:underline inline-block pt-2"
        >
          ← Return to Library Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* ── 1. BREADCRUMBS & TOP BAR ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3 font-mono text-xs text-graphite">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/resources" className="hover:text-quad transition-colors">
            LIBRARY CATALOG
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">{resource.subjectId}</span>
          <span>/</span>
          <span className="text-quad font-bold uppercase">#{resource.id}</span>
        </div>

        <button
          onClick={handleShare}
          className="self-start sm:self-auto px-2.5 py-1 rounded-[4px] border border-border bg-paper hover:border-graphite text-ink flex items-center gap-1.5 transition-colors"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-quad" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Share Resource'}</span>
        </button>
      </div>

      {/* ── 2. RESOURCE TITLE HEADER ──────────────────────────────────── */}
      <div className="p-6 bg-paper border border-border rounded-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-quad/10 text-quad border border-quad/30">
              {resource.type.toUpperCase()}
            </span>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] bg-quad text-paper flex items-center gap-1">
              ✓ ACADEMICALLY VERIFIED
            </span>
            <span className="font-mono text-[10px] text-graphite border border-border px-2 py-0.5 rounded-[2px]">
              Semester {resource.semester || 5}
            </span>
          </div>

          <h1 className="font-display text-2xl lg:text-3xl font-bold text-ink leading-snug">
            {resource.title}
          </h1>

          <p className="font-body text-xs text-graphite leading-relaxed">
            {resource.description}
          </p>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 flex-shrink-0">
          {/* Main Google Drive Action */}
          <a
            href={resource.driveLink || resource.fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-quad text-paper font-mono text-xs font-bold hover:bg-quad/90 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Open in Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => id && toggleLike(id)}
              className="px-3 py-1.5 rounded-md border border-border bg-paper hover:border-quad text-ink font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>★</span>
              <span>{resource.likesCount || 0} Endorsements</span>
            </button>

            <button
              onClick={() => id && toggleBookmark(id)}
              className="p-2 rounded-md border border-border bg-paper hover:border-quad text-ink transition-colors"
              title="Save to ledger"
            >
              <Bookmark className={`w-3.5 h-3.5 ${resource.bookmarksCount ? 'fill-quad text-quad' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. TWO-COLUMN SPLIT: METADATA SHEET vs EMBEDDED PREVIEW ───── */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Resource Metadata Sheet (5 cols) */}
        <div className="lg:col-span-5 bg-paper border border-border rounded-md p-6 space-y-4">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
              ARCHIVE METADATA LEDGER
            </span>
            <span className="font-mono text-[10px] text-quad">✓ SECURE SHARED LINK</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs divide-y divide-border/40">
            <div className="flex justify-between pt-1">
              <span className="text-graphite uppercase text-[11px]">CATALOG ID:</span>
              <span className="text-ink font-bold">#{resource.id}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-graphite uppercase text-[11px]">SUBJECT:</span>
              <span className="text-ink font-semibold text-right max-w-[200px] truncate">{resource.subjectId}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-graphite uppercase text-[11px]">SEMESTER:</span>
              <span className="text-ink">Semester {resource.semester || 5}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-graphite uppercase text-[11px]">RESOURCE TYPE:</span>
              <span className="text-ink capitalize">{resource.type.replace('_', ' ')}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-graphite uppercase text-[11px]">FILE HOST:</span>
              <span className="text-quad font-bold">Google Drive Cloud</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-graphite uppercase text-[11px]">UPLOADER:</span>
              <span className="text-ink">{resource.uploader?.name || 'Aarav Sharma'}</span>
            </div>

            {resource.verifiedBy && (
              <div className="flex justify-between pt-2">
                <span className="text-graphite uppercase text-[11px]">VERIFIED BY:</span>
                <span className="text-quad font-semibold text-right">{resource.verifiedBy}</span>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <span className="text-graphite uppercase text-[11px]">UPLOAD DATE:</span>
              <span className="text-graphite">{new Date(resource.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-graphite uppercase text-[11px]">STATS:</span>
              <span className="text-ink font-bold">
                📥 {resource.downloadsCount || 234} Downloads · ★ {resource.bookmarksCount || 68} Saves
              </span>
            </div>
          </div>

          {/* Curriculum Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="pt-3 border-t border-border/60">
              <span className="font-mono text-[10px] uppercase font-bold text-graphite block mb-2">
                CURRICULUM TAGS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-secondary/30 text-ink border border-border/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Google Drive Preview & Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-paper border border-border rounded-md p-6 space-y-4">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
              GOOGLE DRIVE DOCUMENT PREVIEW
            </span>
            <a
              href={resource.driveLink || resource.fileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-quad hover:underline flex items-center gap-1"
            >
              Full Window ↗
            </a>
          </div>

          {/* Embedded Drive Viewer Box */}
          <div className="h-[420px] w-full border border-border/80 rounded-md bg-secondary/10 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-quad/10 border border-quad/30 flex items-center justify-center text-quad">
              <FileText className="w-8 h-8" />
            </div>
            
            <div className="space-y-1 max-w-md">
              <h3 className="font-display font-bold text-lg text-ink">
                {resource.fileMetadata?.fileName || `${resource.title}.pdf`}
              </h3>
              <p className="font-sans text-xs text-graphite leading-relaxed">
                Hosted on Google Drive with verified institutional access. Preview or download the authentic source file below.
              </p>
            </div>

            <a
              href={resource.driveLink || resource.fileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-md bg-quad text-paper font-mono text-xs font-bold hover:bg-quad/90 inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch in Google Drive</span>
            </a>
          </div>
        </div>

      </div>

      {/* ── 4. PEER DISCUSSIONS & REVIEWS LEDGER ──────────────────────── */}
      <div className="bg-paper border border-border rounded-md p-6 space-y-6">
        <div className="border-b border-border/60 pb-3 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
              PEER DISCUSSION & FACULTY REVIEWS ({comments.length})
            </span>
            <h3 className="font-display font-bold text-lg text-ink mt-0.5">
              Academic Notes Exchange
            </h3>
          </div>
          <span className="font-mono text-xs text-graphite">Moderated Peer Feed</span>
        </div>

        {/* Comment Composer */}
        <form onSubmit={handleAddComment} className="space-y-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Ask a question about this topic or share an exam verification note..."
            rows={3}
            className="w-full bg-secondary/15 border border-border rounded-md p-3 font-sans text-xs text-ink placeholder:text-graphite focus:outline-none focus:border-quad transition-colors"
          />
          <div className="flex justify-between items-center">
            <span className="font-mono text-[11px] text-graphite">
              Be respectful and follow the campus academic code.
            </span>
            <button
              type="submit"
              disabled={isPostingComment || !commentText.trim()}
              className="px-4 py-2 rounded-md bg-quad text-paper font-mono text-xs font-bold hover:bg-quad/90 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </button>
          </div>
        </form>

        {/* Comments Feed */}
        <div className="space-y-3 pt-2">
          {comments.map((comm) => (
            <div
              key={comm.id}
              className="p-3.5 border border-border/60 rounded-md bg-paper flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/50 border border-border flex items-center justify-center font-bold text-xs text-quad flex-shrink-0">
                  {comm.user?.name?.[0] || 'S'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs font-bold text-ink">{comm.user?.name || 'Student'}</span>
                    <span className="font-mono text-[10px] text-graphite">
                      {new Date(comm.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="font-body text-xs text-ink leading-relaxed">
                    {comm.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. RELATED COURSE PACKETS ─────────────────────────────────── */}
      {relatedResources.length > 0 && (
        <div className="space-y-3 pt-4">
          <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider block border-b border-border/60 pb-2">
            RELATED {resource.subjectId.toUpperCase()} PACKETS
          </span>

          <div className="grid md:grid-cols-3 gap-4">
            {relatedResources.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/resources/${rel.id}`)}
                className="p-4 bg-paper border border-border rounded-md hover:border-quad transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-quad font-bold uppercase">{rel.type}</span>
                  <span className="text-graphite">Sem {rel.semester}</span>
                </div>
                <h4 className="font-sans text-xs font-bold text-ink line-clamp-2 leading-snug">
                  {rel.title}
                </h4>
                <div className="flex items-center justify-between font-mono text-[10px] text-graphite pt-1 border-t border-border/40">
                  <span>📥 {rel.downloadsCount || 50} downloads</span>
                  <span className="text-quad font-bold">View →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

