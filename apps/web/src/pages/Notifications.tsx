import React from 'react';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '../store/api/notificationApi';
import { Bell, CheckCheck, Check, Clock } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data?.items || [
    {
      id: 'notif-1',
      title: 'Resource Approved',
      body: 'Your upload "DBMS Normalization Notes" has been approved by faculty.',
      createdAt: new Date().toISOString(),
      isRead: false,
      category: 'academic',
    },
    {
      id: 'notif-2',
      title: 'Upcoming Quiz Deadline',
      body: 'Operating Systems Chapter 4 Quiz closes tonight at 11:59 PM.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
      category: 'academic',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time updates regarding your submissions, grades, and campus announcements.
          </p>
        </div>

        <button
          onClick={() => markAllAsRead()}
          disabled={isMarkingAll}
          className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-primary" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 space-y-2">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-medium">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'border-border bg-card/60'
                  : 'border-primary/40 bg-primary/5 shadow-sm'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{n.title}</h3>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors text-xs flex items-center gap-1 shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
