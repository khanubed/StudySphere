import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetAlumniByIdQuery, useRequestMentorshipMutation } from '../store/api/alumniApi';
import { ArrowLeft, ShieldCheck, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const AlumniProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetAlumniByIdQuery(id || '');
  const [requestMentorship, { isLoading: isRequesting, isSuccess }] = useRequestMentorshipMutation();
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('Career Guidance & Resume Review');

  const profile = data?.data;

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !message.trim()) return;
    await requestMentorship({
      alumniId: id,
      message,
      topic,
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading alumni profile...</div>;
  }

  if (!profile) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-xl font-bold">Profile Not Found</h2>
        <Link to="/alumni" className="text-primary text-sm hover:underline">
          Back to Alumni Network
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/alumni"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Alumni Directory
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm md:col-span-1 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mx-auto">
            A
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="font-bold text-lg">Alumni Mentor</h2>
              {profile.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile.designation || 'Software Engineer'} at {profile.currentCompany || 'Tech'}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Class of {profile.graduationYear}
            </p>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="pt-3 border-t border-border space-y-2 text-left">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Specialties</h4>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm md:col-span-2">
          <h3 className="font-bold text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Request Mentorship Session
          </h3>

          {isSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-semibold text-sm">Mentorship Request Sent</h4>
              <p className="text-xs text-muted-foreground">
                You will be notified once the alumni accepts your connection.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-xs font-medium mb-1">
                  Topic of Discussion
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium mb-1">
                  Introduction & Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself, your academic year, and specific questions you have..."
                  className="w-full p-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isRequesting || !message.trim()}
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isRequesting ? 'Sending...' : 'Send Mentorship Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
