import React from 'react';
import { Link } from 'react-router-dom';
import { useGetJobsQuery } from '../store/api/careerApi';
import { Briefcase, MapPin, DollarSign, ArrowRight, Building } from 'lucide-react';

export const CareerHub: React.FC = () => {
  const { data, isLoading } = useGetJobsQuery();
  const jobs = data?.data?.items || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Hub & Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover internships, full-time campus placements, and verified student opportunities.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading job listings...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 space-y-2">
            <Briefcase className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-medium">No open positions currently</p>
            <p className="text-xs text-muted-foreground">Check back soon for new campus job and internship postings.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/50 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">
                    {job.isInternship ? 'Internship' : 'Full Time'}
                  </span>
                  {job.isRemote && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      Remote
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" /> {job.company}
                  </span>
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                  )}
                  {job.stipend && (
                    <span className="flex items-center gap-1 text-foreground font-semibold">
                      <DollarSign className="w-3.5 h-3.5" /> ${job.stipend}/mo
                    </span>
                  )}
                </div>
              </div>

              <Link
                to={`/career/${job.id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm self-start md:self-auto"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
