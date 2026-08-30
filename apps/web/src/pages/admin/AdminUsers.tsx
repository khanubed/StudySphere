import React from 'react';
import { useGetAdminUsersQuery, useUpdateUserRoleMutation } from '../../store/api/adminApi';
import { UserCheck } from 'lucide-react';
import { UserRole } from '@studysphere/shared-types';

export const AdminUsers: React.FC = () => {
  const { data } = useGetAdminUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const users = data?.data?.items || [
    {
      id: 'usr-1',
      name: 'Alex Johnson',
      email: 'alex@campus.edu',
      role: 'student' as UserRole,
      createdAt: new Date().toISOString(),
      isVerified: true,
      isActive: true,
    },
    {
      id: 'usr-2',
      name: 'Dr. Sarah Connor',
      email: 'sconnor@faculty.edu',
      role: 'faculty' as UserRole,
      createdAt: new Date().toISOString(),
      isVerified: true,
      isActive: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User & Role Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all registered campus accounts and promote users to faculty or administrator roles.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-4">
                    <div className="font-semibold text-foreground">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <UserCheck className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateUserRole({
                          userId: u.id,
                          role: e.target.value as UserRole,
                        })
                      }
                      className="px-2.5 py-1 text-xs border border-input rounded-lg bg-background"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="alumni">Alumni</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
