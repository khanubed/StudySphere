import React from 'react';
import { useGetModerationQueueQuery, useReviewModerationItemMutation } from '../../store/api/adminApi';
import { ShieldCheck, Check, X } from 'lucide-react';

export const AdminModeration: React.FC = () => {
  const { data, isLoading } = useGetModerationQueueQuery();
  const [reviewItem] = useReviewModerationItemMutation();

  const items = data?.data?.items || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content & Resource Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve or reject uploaded study documents before they become publicly searchable.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading moderation queue...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-medium">Moderation queue is clean!</p>
            <p className="text-xs text-muted-foreground">No pending items requiring review.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-border bg-card flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {item.resource.type}
                </span>
                <h3 className="font-bold text-base">{item.resource.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Uploaded by: {item.resource.uploader?.name || 'Student'} • {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => reviewItem({ itemId: item.id, action: 'approve' })}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => reviewItem({ itemId: item.id, action: 'reject' })}
                  className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
