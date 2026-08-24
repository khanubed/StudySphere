import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GraduationCap, Award, BrainCircuit, Library, TrendingUp } from 'lucide-react';

const chartData = [
  { name: 'Mon', hours: 4, queries: 3 },
  { name: 'Tue', hours: 6, queries: 8 },
  { name: 'Wed', hours: 3, queries: 4 },
  { name: 'Thu', hours: 8, queries: 12 },
  { name: 'Fri', hours: 5, queries: 7 },
  { name: 'Sat', hours: 2, queries: 2 },
  { name: 'Sun', hours: 4, queries: 5 },
];

export const Dashboard: React.FC = () => {
  const { user, tokenUsageLimit, tokenUsageUsed } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Scholar'}!</h1>
        <p className="text-sm text-muted-foreground">Here is your academic and productivity progress for this semester.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="border border-border p-4 rounded-card bg-muted/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase">Current SGPA</span>
            <p className="text-2xl font-extrabold">9.12</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border border-border p-4 rounded-card bg-muted/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase">Study Streak</span>
            <p className="text-2xl font-extrabold">12 Days</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="border border-border p-4 rounded-card bg-muted/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase">AI Generations</span>
            <p className="text-2xl font-extrabold">{tokenUsageUsed} / {tokenUsageLimit}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <BrainCircuit className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="border border-border p-4 rounded-card bg-muted/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase">Uploaded Items</span>
            <p className="text-2xl font-extrabold">8 PDFs</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Library className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="border border-border rounded-card bg-muted/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Study & AI Activity
            </h3>
            <p className="text-xs text-muted-foreground">Weekly breakdown of study hours and AI-assisted lookups.</p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(255, 82%, 62%)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(255, 82%, 62%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--muted))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="hours" stroke="hsl(255, 82%, 62%)" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" name="Study Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
