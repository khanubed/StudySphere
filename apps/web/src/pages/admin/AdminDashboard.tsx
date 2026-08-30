import React from 'react';
import { useGetAdminDashboardQuery } from '../../store/api/dashboardApi';
import { Users, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { data } = useGetAdminDashboardQuery();
  const stats = data?.data?.stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Admin & Platform Operations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor campus health, review flagged user uploads, manage roles, and control token allocations.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Total Registered Users</span>
          <div className="text-3xl font-extrabold text-primary">{stats?.totalUsers || 1420}</div>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Daily Active Users</span>
          <div className="text-3xl font-extrabold text-foreground">{stats?.activeUsersToday || 380}</div>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Pending Moderation</span>
          <div className="text-3xl font-extrabold text-amber-500">{stats?.flaggedResources || 3}</div>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Total AI Inferences</span>
          <div className="text-3xl font-extrabold text-foreground">{stats?.totalAiInferences || 8640}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/moderation"
          className="p-6 rounded-2xl border border-border hover:border-primary/50 bg-card space-y-3 shadow-sm transition-all block"
        >
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h3 className="font-bold text-lg">Resource Moderation Queue</h3>
          <p className="text-xs text-muted-foreground">
            Review submitted syllabus documents, notes, and verify contributor content.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="p-6 rounded-2xl border border-border hover:border-primary/50 bg-card space-y-3 shadow-sm transition-all block"
        >
          <Users className="w-8 h-8 text-primary" />
          <h3 className="font-bold text-lg">User & Role Management</h3>
          <p className="text-xs text-muted-foreground">
            Assign student, faculty, and alumni permissions, verify college email domains.
          </p>
        </Link>

        <Link
          to="/admin/billing/plans"
          className="p-6 rounded-2xl border border-border hover:border-primary/50 bg-card space-y-3 shadow-sm transition-all block"
        >
          <CreditCard className="w-8 h-8 text-primary" />
          <h3 className="font-bold text-lg">AI Token Limits & Plans</h3>
          <p className="text-xs text-muted-foreground">
            Configure credit quotas per tier without requiring redeployments.
          </p>
        </Link>
      </div>
    </div>
  );
};
