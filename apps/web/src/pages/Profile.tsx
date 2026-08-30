import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account & Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal info, academic details, and verified university status.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card text-center space-y-4 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-3xl mx-auto">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="font-bold text-xl">{user?.name || 'Student User'}</h2>
            <p className="text-xs text-muted-foreground">{user?.email || 'user@campus.edu'}</p>
            <span className="inline-block mt-2 text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {user?.role || 'student'}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm md:col-span-2">
          <h3 className="font-bold text-base border-b border-border pb-3">Academic Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">Institution</span>
              <p className="font-medium">{user?.institution?.name || 'Apex Institute of Technology'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Department</span>
              <p className="font-medium">Computer Science & Engineering</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Current Semester</span>
              <p className="font-medium">Semester 6</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Academic CGPA</span>
              <p className="font-medium">8.75 / 10.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
