import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetJobByIdQuery, useApplyForJobMutation } from '../store/api/careerApi';
import { ArrowLeft, Building, MapPin, DollarSign, Send, CheckCircle2 } from 'lucide-react';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetJobByIdQuery(id || '');
  const [applyForJob, { isLoading: isApplying, isSuccess }] = useApplyForJobMutation();

  const job = data?.data;

  const handleApply = async () => {
    if (!id) return;
    await applyForJob({
      jobId: id,
      resumeUrl: 'https://storage.studysphere.app/resumes/default.pdf',
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading job opportunity...</div>;
  }

  if (!job) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <Link to="/career" className="text-primary text-sm hover:underline">
          Back to Career Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/career"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Career Hub
      </Link>

      <div className="p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {job.isInternship ? 'Internship' : 'Full Time'}
            </span>
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Building className="w-4 h-4 text-primary" /> {job.company}
              </span>
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
              )}
              {job.stipend && (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <DollarSign className="w-4 h-4" /> ${job.stipend}/mo
                </span>
              )}
            </div>
          </div>

          <div>
            {isSuccess ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-semibold text-sm border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" /> Applied
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isApplying ? 'Submitting...' : 'Apply Now'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base mb-2">Job Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {job.requirements && (
            <div className="border-t border-border pt-4">
              <h3 className="font-bold text-base mb-2">Requirements</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
