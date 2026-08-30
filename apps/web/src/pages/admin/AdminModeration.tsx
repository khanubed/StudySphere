import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  Clock,
} from 'lucide-react';
import {
  useGetResourceModerationQueueQuery,
  useModerateResourceMutation,
} from '../../store/api/resourceApi';
import { Resource } from '@studysphere/shared-types';

export const AdminModeration: React.FC = () => {
  const { data: queueResponse, isLoading } = useGetResourceModerationQueueQuery();
  const [moderateResource, { isLoading: isModerating }] = useModerateResourceMutation();

  const [activeModal, setActiveModal] = useState<{
    resource: Resource;
    action: 'reject' | 'request_changes';
  } | null>(null);

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const items = queueResponse?.data || [];

  const handleApprove = async (id: string) => {
    try {
      await moderateResource({ id, action: 'approve' }).unwrap();
    } catch {
      // Handled
    }
  };

  const handleConfirmDecision = async () => {
    if (!activeModal) return;

    if (!feedbackText.trim() || feedbackText.trim().length < 10) {
      setFeedbackError('A descriptive reason is required (minimum 10 characters).');
      return;
    }

    try {
      await moderateResource({
        id: activeModal.resource.id,
        action: activeModal.action,
        feedback: feedbackText.trim(),
      }).unwrap();

      setActiveModal(null);
      setFeedbackText('');
      setFeedbackError(null);
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* ── 1. PAGE HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-graphite mb-1">
            <span>FACULTY & ADMIN AUDIT</span>
            <span>/</span>
            <span className="text-quad font-bold">KNOWLEDGE ARCHIVE QUEUE</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Resource Moderation & Quality Control
          </h1>
          <p className="font-body text-xs text-graphite mt-0.5">
            Verify Google Drive permissions, review academic relevance, and ensure syllabus alignment before public listing.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-ink bg-paper border border-border p-2 rounded-md">
          <Clock className="w-4 h-4 text-marker" />
          <span>Queue Backlog: <strong className="text-quad">{items.length} Pending</strong></span>
        </div>
      </div>

      {/* ── 2. MODERATION QUEUE TABLE ─────────────────────────────────── */}
      <div className="bg-paper border border-border rounded-md p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
            PENDING SUBMISSIONS LEDGER
          </span>
          <span className="font-mono text-[11px] text-quad">✓ 24H SLA COMPLIANT</span>
        </div>

        {isLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-secondary/20 rounded animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-md bg-paper space-y-2">
            <ShieldCheck className="w-10 h-10 text-quad mx-auto" />
            <h3 className="font-display font-bold text-lg text-ink">Moderation Queue Clear</h3>
            <p className="font-sans text-xs text-graphite">
              All submitted courseware has been reviewed and verified.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-border/60 font-mono text-[11px] text-graphite uppercase">
                  <th className="py-2.5 px-3">Entry</th>
                  <th className="py-2.5 px-3">Subject / Sem</th>
                  <th className="py-2.5 px-3">Uploader</th>
                  <th className="py-2.5 px-3 text-center">Drive Link Test</th>
                  <th className="py-2.5 px-3 text-center">Submitted</th>
                  <th className="py-2.5 px-3 text-right">Moderator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {items.map((res) => (
                  <tr key={res.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-sans">
                        <span className="font-mono text-[10px] uppercase font-bold text-quad block">
                          [{res.type.toUpperCase()}]
                        </span>
                        <span className="font-bold text-ink text-xs line-clamp-1">{res.title}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-sans text-graphite">
                      <span className="font-semibold text-ink">{res.subjectId}</span>
                      <span className="block text-[11px]">Sem {res.semester || 5}</span>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <span className="font-medium text-ink">{res.uploader?.name || 'Student'}</span>
                      <span className="block text-[10px] text-graphite font-mono">ID: {res.uploadedBy}</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <a
                        href={res.driveLink || res.fileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] border border-border bg-paper hover:border-quad text-ink font-mono text-[11px] transition-colors"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3 text-quad" />
                      </a>
                    </td>

                    <td className="py-3 px-3 text-center text-graphite">
                      {new Date(res.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs">
                        <button
                          onClick={() => handleApprove(res.id)}
                          disabled={isModerating}
                          className="px-2.5 py-1 rounded-[4px] bg-quad text-paper font-bold hover:bg-quad/90 transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>

                        <button
                          onClick={() => {
                            setActiveModal({ resource: res, action: 'request_changes' });
                            setFeedbackText('');
                            setFeedbackError(null);
                          }}
                          disabled={isModerating}
                          className="px-2.5 py-1 rounded-[4px] border border-marker bg-marker/15 text-ink hover:bg-marker/30 transition-colors"
                        >
                          Request Changes
                        </button>

                        <button
                          onClick={() => {
                            setActiveModal({ resource: res, action: 'reject' });
                            setFeedbackText('');
                            setFeedbackError(null);
                          }}
                          disabled={isModerating}
                          className="px-2 py-1 rounded-[4px] border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 3. MODERATION DECISION DIALOG ─────────────────────────────── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-border rounded-md max-w-lg w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-border/60 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${activeModal.action === 'reject' ? 'text-destructive' : 'text-marker'}`} />
                <h3 className="font-display font-bold text-lg text-ink">
                  {activeModal.action === 'reject' ? 'Reject Submission' : 'Request Changes'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-graphite hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <p className="font-sans text-xs text-graphite">
                Target: <span className="font-semibold text-ink">"{activeModal.resource.title}"</span>
              </p>
              
              <label className="block font-mono text-xs font-bold text-ink uppercase">
                {activeModal.action === 'reject'
                  ? 'Mandatory Rejection Rationale (min 10 chars) *'
                  : 'Instructions for Student / Uploader (min 10 chars) *'}
              </label>

              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => {
                  setFeedbackText(e.target.value);
                  if (e.target.value.length >= 10) setFeedbackError(null);
                }}
                placeholder={
                  activeModal.action === 'reject'
                    ? 'State the reason for rejection (e.g. copyright scan failed, low quality document, duplicate upload)...'
                    : 'Specify what needs to be changed (e.g. update Drive permission to "Anyone with the link can view", specify Unit number)...'
                }
                className="w-full bg-secondary/15 border border-border rounded-md p-3 font-sans text-xs text-ink placeholder:text-graphite focus:outline-none focus:border-quad transition-colors"
              />

              {feedbackError && (
                <p className="font-mono text-xs text-destructive">
                  {feedbackError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60 font-mono text-xs">
              <button
                onClick={() => setActiveModal(null)}
                className="px-3.5 py-2 rounded-md border border-border bg-paper hover:border-graphite text-ink"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDecision}
                disabled={isModerating}
                className={`px-4 py-2 rounded-md font-bold text-paper transition-colors ${
                  activeModal.action === 'reject'
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-quad hover:bg-quad/90'
                }`}
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

