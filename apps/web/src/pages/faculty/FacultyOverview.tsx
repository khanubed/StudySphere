import React from 'react';
import { useGetFacultyDashboardQuery } from '../../store/api/dashboardApi';
import { HelpCircle, Megaphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyOverview: React.FC = () => {
  const { data } = useGetFacultyDashboardQuery();
  const stats = data?.data?.stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Faculty Portal & Teaching Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Distribute curriculum materials, run AI-assisted class assessments, and publish course announcements.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Active Enrolled Students</span>
          <div className="text-3xl font-extrabold text-primary">{stats?.totalStudents || 120}</div>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Active Courses & Classes</span>
          <div className="text-3xl font-extrabold text-foreground">{stats?.activeClasses || 4}</div>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Course Resources</span>
          <div className="text-3xl font-extrabold text-foreground">{stats?.resourcesUploaded || 18}</div>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Pending Submissions</span>
          <div className="text-3xl font-extrabold text-amber-500">{stats?.pendingEvaluations || 6}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/faculty/quizzes/new"
              className="p-4 rounded-xl border border-border hover:border-primary/40 bg-background text-sm font-semibold flex flex-col items-center justify-center gap-2 text-center"
            >
              <HelpCircle className="w-6 h-6 text-primary" />
              <span>Create AI Quiz</span>
            </Link>
            <Link
              to="/faculty/announcements"
              className="p-4 rounded-xl border border-border hover:border-primary/40 bg-background text-sm font-semibold flex flex-col items-center justify-center gap-2 text-center"
            >
              <Megaphone className="w-6 h-6 text-primary" />
              <span>New Announcement</span>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="font-bold text-base">Class Performance Summary</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Attendance and quiz scores are trending positive across CS-301 (DBMS) and CS-402 (Operating Systems).
          </p>
          <Link
            to="/faculty/analytics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            View Complete Class Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
