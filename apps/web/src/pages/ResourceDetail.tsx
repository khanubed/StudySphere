import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetResourceByIdQuery, useToggleLikeResourceMutation, useToggleBookmarkResourceMutation } from '../store/api/resourceApi';
import { ArrowLeft, Heart, Bookmark, Download, MessageSquare, ShieldCheck, User } from 'lucide-react';

export const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetResourceByIdQuery(id || '');
  const [toggleLike] = useToggleLikeResourceMutation();
  const [toggleBookmark] = useToggleBookmarkResourceMutation();

  const resource = data?.data;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading resource details...
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Resource Not Found</h2>
        <Link to="/resources" className="text-primary text-sm hover:underline">
          Back to Resource Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Resources
      </Link>

      <div className="p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {resource.type}
              </span>
              {resource.status === 'published' && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{resource.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {resource.uploader?.name || 'Anonymous Contributor'}
              </span>
              <span>•</span>
              <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => id && toggleLike(id)}
              className="p-2.5 rounded-xl border border-border hover:bg-muted/80 text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-1.5 text-sm"
            >
              <Heart className="w-4 h-4" />
              <span>{resource.likesCount || 0}</span>
            </button>
            <button
              onClick={() => id && toggleBookmark(id)}
              className="p-2.5 rounded-xl border border-border hover:bg-muted/80 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-sm"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {resource.description && (
          <div className="text-sm text-foreground/90 leading-relaxed border-t border-border pt-4">
            <h3 className="font-semibold mb-1 text-foreground">Description</h3>
            <p>{resource.description}</p>
          </div>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>{resource.commentsCount || 0} Comments</span>
          </div>

          {resource.fileUrl && (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Resource
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
