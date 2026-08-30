import React, { useState } from 'react';
import { useGetAnnouncementsQuery, useCreateAnnouncementMutation } from '../../store/api/facultyApi';
import { Megaphone, Plus, Pin } from 'lucide-react';

export const FacultyAnnouncements: React.FC = () => {
  const { data, isLoading } = useGetAnnouncementsQuery();
  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const announcements = data?.data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    await createAnnouncement({ title, message });
    setTitle('');
    setMessage('');
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Broadcast updates, exam alerts, and lecture changes directly to enrolled students.
          </p>
        </div>

        <button
          onClick={() => setShowModal(!showModal)}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showModal && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="font-bold text-base">Compose Broadcast</h3>
          <div>
            <label htmlFor="announcementTitle" className="block text-xs font-medium mb-1">
              Title
            </label>
            <input
              id="announcementTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Examination Schedule Released"
              className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="announcementMessage" className="block text-xs font-medium mb-1">
              Message Content
            </label>
            <textarea
              id="announcementMessage"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide details for students..."
              className="w-full p-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-border rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm"
            >
              {isCreating ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 space-y-2">
            <Megaphone className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-medium">No announcements published</p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Pin className="w-4 h-4 text-primary" /> {a.title}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
