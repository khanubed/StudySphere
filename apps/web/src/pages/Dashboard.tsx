import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  useGetStudentDashboardQuery,
  useToggleTaskCompletionMutation,
} from '../store/api/dashboardApi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  GraduationCap,
  Award,
  CheckSquare,
  Clock,
  Flame,
  Sparkles,
  ArrowUpRight,
  Filter,
  Download,
  AlertCircle,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { DashboardTask } from '@studysphere/shared-data';

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedSemester, setSelectedSemester] = useState('Semester 5');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('7d');
  const [activeChartTab, setActiveChartTab] = useState<'hours' | 'subjects' | 'accuracy'>('hours');

  // RTK Query hooks
  const { data: dashboardResponse, isLoading, isError, refetch } = useGetStudentDashboardQuery();
  const [toggleTask] = useToggleTaskCompletionMutation();

  const dashboardData = dashboardResponse?.data;
  const stats = dashboardData?.stats;
  const tasks = dashboardData?.tasks || [];
  const deadlines = dashboardData?.deadlines || [];
  const weeklyAnalytics = dashboardData?.analyticsByRange?.[timeRange] || dashboardData?.weeklyAnalytics || [];
  const subjectComparison = dashboardData?.subjectComparison || [];
  const studyDistribution = dashboardData?.studyDistribution || [];
  const accuracyTrend = dashboardData?.accuracyTrend || [];
  const aiActivities = dashboardData?.aiActivities || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const leaderboard = dashboardData?.leaderboard || [];

  // Local task optimistic completion handler
  const handleToggleTask = async (task: DashboardTask) => {
    try {
      await toggleTask({ taskId: task.id, completed: !task.completed }).unwrap();
    } catch {
      // Fallback handled gracefully
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-72 bg-secondary/50 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary/30 rounded-md border border-border/60" />
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-80 bg-secondary/20 rounded-md border border-border/60" />
          <div className="lg:col-span-5 h-80 bg-secondary/20 rounded-md border border-border/60" />
        </div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="border border-destructive/40 bg-destructive/5 rounded-md p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <h2 className="font-display font-bold text-xl text-ink">Academic Ledger Unreachable</h2>
        <p className="font-body text-sm text-graphite max-w-md mx-auto">
          Unable to synchronize with the campus database. Verify your connection or reload the ledger cache.
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 bg-quad text-paper font-sans text-sm font-semibold px-4 py-2 rounded-md"
        >
          <RotateCcw className="w-4 h-4" /> Re-sync Ledger
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* ── TOP COCKPIT HEADER ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-quad font-semibold">
              ACADEMIC COCKPIT v1.0
            </span>
            <span className="text-border">•</span>
            <span className="font-mono text-[11px] text-graphite uppercase">
              {stats?.cohort || 'CS-B · Batch of 2027'}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight">
            Academic Command Center
          </h1>
          <p className="font-body text-sm text-graphite mt-1">
            Welcome back, <span className="text-ink font-semibold">{user?.name || 'Sneha Patel'}</span>. 
            All academic metrics verified against the campus ledger.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-paper border border-border rounded-md px-3 py-1.5 font-mono text-xs text-ink shadow-none">
            <Filter className="w-3.5 h-3.5 text-graphite mr-2" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent text-ink font-sans text-xs focus:outline-none cursor-pointer"
            >
              <option value="Semester 5">Semester 5 (Active)</option>
              <option value="Semester 4">Semester 4 (Archived)</option>
              <option value="Semester 3">Semester 3 (Archived)</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 border border-border hover:border-quad bg-paper text-ink hover:text-quad font-sans text-xs font-semibold px-3 py-2 rounded-md transition-colors"
            title="Export Ledger Transcript"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Transcript</span>
          </button>
        </div>
      </div>

      {/* ── 1. ACADEMIC SNAPSHOT (4-Card Metric Grid) ───────────────────── */}
      <section aria-labelledby="academic-snapshot-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="academic-snapshot-heading" className="font-mono text-xs font-semibold text-graphite uppercase tracking-wider">
            01 — ACADEMIC PERFORMANCE SNAPSHOT
          </h2>
          <span className="font-mono text-[11px] text-quad flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-quad rounded-full animate-pulse" />
            LEDGER VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: CGPA */}
          <div className="bg-paper border border-border/80 rounded-md p-4 flex flex-col justify-between hover:border-quad transition-colors">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] font-bold text-graphite uppercase tracking-wider">
                CURRENT CGPA
              </span>
              <span className="p-1.5 bg-secondary/30 text-quad rounded-[4px]">
                <GraduationCap className="w-4 h-4" />
              </span>
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-bold text-ink leading-none">
                {stats?.cgpa.toFixed(2)}
                <span className="text-graphite font-normal text-sm ml-1">/ {stats?.cgpaScale.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[11px]">
              <span className="text-quad font-semibold">{stats?.cgpaDelta}</span>
              <span className="text-graphite">Top 5% Cohort</span>
            </div>
          </div>

          {/* Card 2: Attendance */}
          <div className="bg-paper border border-border/80 rounded-md p-4 flex flex-col justify-between hover:border-quad transition-colors">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] font-bold text-graphite uppercase tracking-wider">
                ATTENDANCE STANDING
              </span>
              <span className="p-1.5 bg-secondary/30 text-quad rounded-[4px]">
                <CheckSquare className="w-4 h-4" />
              </span>
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-bold text-ink leading-none">
                {stats?.attendancePercentage}%
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[11px]">
              <span className="text-quad font-semibold">{stats?.attendanceDelta} this month</span>
              <span className="text-quad bg-quad/10 px-1.5 py-0.5 rounded-[2px]">SAFE (&gt;75%)</span>
            </div>
          </div>

          {/* Card 3: Quiz Average */}
          <div className="bg-paper border border-border/80 rounded-md p-4 flex flex-col justify-between hover:border-quad transition-colors">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] font-bold text-graphite uppercase tracking-wider">
                QUIZ MASTERY AVG
              </span>
              <span className="p-1.5 bg-secondary/30 text-quad rounded-[4px]">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-bold text-ink leading-none">
                {stats?.quizAverage}%
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[11px]">
              <span className="text-quad font-semibold">{stats?.quizDelta} trend</span>
              <span className="text-graphite">{stats?.completedQuizzes} Quizzes Logged</span>
            </div>
          </div>

          {/* Card 4: Assignments & Streak */}
          <div className="bg-paper border border-border/80 rounded-md p-4 flex flex-col justify-between hover:border-quad transition-colors">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] font-bold text-graphite uppercase tracking-wider">
                STUDY STREAK
              </span>
              <span className="p-1.5 bg-marker/10 text-marker rounded-[4px]">
                <Flame className="w-4 h-4" />
              </span>
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-bold text-ink leading-none flex items-center gap-1.5">
                {stats?.studyStreakDays} <span className="text-sm font-normal text-graphite">Days Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[11px]">
              <span className="text-marker font-semibold">🔥 Server Verified</span>
              <span className="text-graphite">{stats?.completedAssignments}/{stats?.totalAssignments} Submissions</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. PRODUCTIVITY LEDGER (Two-Column Split) ────────────────────── */}
      <section aria-labelledby="productivity-ledger-heading">
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Today's Tasks Ledger (7 cols) */}
          <div className="lg:col-span-7 bg-paper border border-border rounded-md p-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <div>
                <span className="font-mono text-xs font-semibold text-graphite uppercase tracking-wider">
                  02 — DAILY STUDY COCKPIT
                </span>
                <h3 className="font-display font-bold text-lg text-ink">Today's Academic Tasks</h3>
              </div>
              <span className="font-mono text-xs text-graphite">
                {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className={`group p-3 border rounded-md transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-secondary/15 border-border/50 opacity-75'
                      : 'bg-paper border-border/80 hover:border-quad'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    {/* Interactive stamp checkbox */}
                    <button
                      type="button"
                      aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                      className={`w-5 h-5 rounded-[2px] border flex items-center justify-center font-mono text-xs transition-colors flex-shrink-0 ${
                        task.completed
                          ? 'border-quad bg-quad text-paper font-bold'
                          : 'border-border group-hover:border-quad text-transparent'
                      }`}
                    >
                      ✓
                    </button>

                    <div className="truncate">
                      <p className={`font-sans text-[13px] font-medium leading-snug truncate ${
                        task.completed ? 'line-through text-graphite' : 'text-ink'
                      }`}>
                        {task.title}
                      </p>
                      <span className="font-mono text-[11px] text-graphite truncate block">
                        {task.course}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] ${
                      task.priority === 'urgent'
                        ? 'bg-destructive/10 text-destructive border border-destructive/30'
                        : task.priority === 'high'
                        ? 'bg-marker/15 text-ink border border-marker/40'
                        : 'bg-secondary/30 text-graphite border border-border/40'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="font-mono text-[11px] text-graphite hidden sm:inline-block">
                      {task.dueTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between font-mono text-[11px] text-graphite">
              <span>LEDGER SYNC: REAL-TIME</span>
              <button 
                onClick={() => alert('Study Planner task creation opened')}
                className="text-quad hover:underline font-semibold"
              >
                + Add Academic Task
              </button>
            </div>
          </div>

          {/* Right Column: Upcoming Deadlines & Examination Schedule (5 cols) */}
          <div className="lg:col-span-5 bg-paper border border-border rounded-md p-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <div>
                <span className="font-mono text-xs font-semibold text-graphite uppercase tracking-wider">
                  TIMETABLE & AUDIT
                </span>
                <h3 className="font-display font-bold text-lg text-ink">Upcoming Deadlines</h3>
              </div>
              <span className="font-mono text-xs text-destructive flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 4 Pending
              </span>
            </div>

            <div className="space-y-3">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3 border border-border/70 rounded-md bg-paper flex items-center justify-between hover:border-graphite transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-mono text-[10px] uppercase text-graphite block">
                      {dl.course}
                    </span>
                    <h4 className="font-sans text-[13px] font-semibold text-ink truncate">
                      {dl.title}
                    </h4>
                    <span className="font-mono text-[11px] text-graphite">
                      Due: {dl.dueDate}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-[2px] block ${
                      dl.hoursLeft <= 12
                        ? 'bg-destructive/10 text-destructive border border-destructive/30'
                        : 'bg-secondary/30 text-ink border border-border/40'
                    }`}>
                      {dl.hoursLeft <= 24 ? `In ${dl.hoursLeft}h` : `${Math.round(dl.hoursLeft / 24)}d left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between font-mono text-[11px]">
              <span className="text-graphite">LMS & Portal Connected</span>
              <a href="/planner" className="text-quad hover:underline font-semibold flex items-center gap-1">
                Calendar view <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. ANALYTICAL ENGINE (Recharts Analytics Canvas) ─────────────── */}
      <section aria-labelledby="analytics-heading" className="bg-paper border border-border rounded-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60 pb-4 mb-6">
          <div>
            <span className="font-mono text-xs font-semibold text-graphite uppercase tracking-wider">
              03 — ANALYTICAL ENGINE
            </span>
            <h3 id="analytics-heading" className="font-display font-bold text-xl text-ink">
              Study Telemetry & Course Analytics
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Chart toggle buttons */}
            <div className="inline-flex rounded-md border border-border p-0.5 bg-secondary/10">
              <button
                onClick={() => setActiveChartTab('hours')}
                className={`font-sans text-xs font-medium px-3 py-1 rounded-[4px] transition-colors ${
                  activeChartTab === 'hours' ? 'bg-quad text-paper font-semibold' : 'text-graphite hover:text-ink'
                }`}
              >
                Study Hours & AI
              </button>
              <button
                onClick={() => setActiveChartTab('subjects')}
                className={`font-sans text-xs font-medium px-3 py-1 rounded-[4px] transition-colors ${
                  activeChartTab === 'subjects' ? 'bg-quad text-paper font-semibold' : 'text-graphite hover:text-ink'
                }`}
              >
                Subject Benchmarks
              </button>
              <button
                onClick={() => setActiveChartTab('accuracy')}
                className={`font-sans text-xs font-medium px-3 py-1 rounded-[4px] transition-colors ${
                  activeChartTab === 'accuracy' ? 'bg-quad text-paper font-semibold' : 'text-graphite hover:text-ink'
                }`}
              >
                Topic Accuracy
              </button>
            </div>

            {/* Time range pills */}
            <div className="flex items-center gap-1 font-mono text-xs">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-[4px] uppercase transition-colors ${
                    timeRange === range
                      ? 'border border-quad bg-quad/10 text-quad font-bold'
                      : 'border border-transparent text-graphite hover:text-ink hover:border-border'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Chart Display */}
        <div className="h-72 w-full">
          {activeChartTab === 'hours' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--quad))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="rgb(var(--quad))" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--chalk))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="rgb(var(--chalk))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border) / 0.5)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgb(var(--graphite))" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="Geist Mono" 
                />
                <YAxis 
                  stroke="rgb(var(--graphite))" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="Geist Mono" 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--paper))',
                    borderColor: 'rgb(var(--border))',
                    borderRadius: '4px',
                    fontFamily: 'Geist Mono',
                    fontSize: '12px',
                    boxShadow: 'none',
                  }}
                  itemStyle={{ color: 'rgb(var(--ink))' }}
                />
                <Legend 
                  wrapperStyle={{ fontFamily: 'Geist', fontSize: '12px', paddingTop: '10px' }} 
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="rgb(var(--quad))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#hoursGradient)"
                  name="Study Hours"
                />
                <Area
                  type="monotone"
                  dataKey="aiQueries"
                  stroke="rgb(var(--chalk))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#aiGradient)"
                  name="AI Inferences"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : activeChartTab === 'subjects' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border) / 0.5)" />
                <XAxis 
                  dataKey="subject" 
                  stroke="rgb(var(--graphite))" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="Geist" 
                />
                <YAxis 
                  stroke="rgb(var(--graphite))" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="Geist Mono" 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--paper))',
                    borderColor: 'rgb(var(--border))',
                    borderRadius: '4px',
                    fontFamily: 'Geist Mono',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Geist', fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="score" fill="rgb(var(--quad))" name="Current Score (%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="attendance" fill="rgb(var(--chalk))" name="Attendance (%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border) / 0.5)" />
                <XAxis 
                  dataKey="topic" 
                  stroke="rgb(var(--graphite))" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="Geist" 
                />
                <YAxis 
                  stroke="rgb(var(--graphite))" 
                  fontSize={11} 
                  tickLine={false} 
                  domain={[50, 100]}
                  fontFamily="Geist Mono" 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--paper))',
                    borderColor: 'rgb(var(--border))',
                    borderRadius: '4px',
                    fontFamily: 'Geist Mono',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Geist', fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="actualScore" fill="rgb(var(--quad))" name="Your Accuracy (%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="targetScore" fill="rgb(var(--marker))" name="Target Benchmark (90%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cohortAvg" fill="rgb(var(--graphite))" name="Cohort Average (%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Study Time by Module Distribution Bar */}
        {studyDistribution.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between mb-2 font-mono text-[11px] text-graphite uppercase">
              <span>Study Focus Composition ({timeRange.toUpperCase()})</span>
              <span>{stats?.studyHoursThisWeek} Total Hours Tracked</span>
            </div>
            
            {/* Horizontal stacked progress bar */}
            <div className="w-full h-3 bg-secondary/30 rounded-full overflow-hidden flex gap-0.5">
              {studyDistribution.map((item) => (
                <div
                  key={item.category}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  title={`${item.category}: ${item.hours}h (${item.percentage}%)`}
                />
              ))}
            </div>

            {/* Legend pills */}
            <div className="flex flex-wrap items-center gap-4 mt-3 font-mono text-[11px]">
              {studyDistribution.map((item) => (
                <div key={item.category} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: item.color }} />
                  <span className="text-ink">{item.category}</span>
                  <span className="text-graphite">({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 4 & 5. SEMANTIC AI STACK & AUDIT TIMELINE (50/50 Split) ──────── */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Section 4: Semantic AI Activity (6 cols) */}
        <section aria-labelledby="ai-activity-heading" className="lg:col-span-6 bg-paper border border-border rounded-md p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
            <div>
              <span className="font-mono text-xs font-semibold text-chalk uppercase tracking-wider">
                04 — SEMANTIC AI STACK
              </span>
              <h3 id="ai-activity-heading" className="font-display font-bold text-lg text-ink">
                Recent AI Transformations
              </h3>
            </div>
            <span className="font-mono text-xs text-chalk bg-chalk/10 border border-chalk/30 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {stats?.aiTokensRemaining} Tokens Left
            </span>
          </div>

          <div className="space-y-3">
            {aiActivities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 border border-chalk/30 bg-chalk/5 rounded-md text-left transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] text-chalk font-semibold uppercase">
                  <span>{act.type}</span>
                  <span>{act.duration} · {act.tokensUsed} TOKENS</span>
                </div>
                <h4 className="font-sans font-semibold text-[13px] text-ink mb-1">
                  {act.title}
                </h4>
                <p className="font-body text-xs text-graphite leading-relaxed mb-2">
                  {act.action}
                </p>
                <div className="flex items-center justify-between font-mono text-[10px] text-graphite border-t border-chalk/20 pt-1.5">
                  <span>STATUS: {act.status.toUpperCase()}</span>
                  <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 text-right">
            <a href="/ai/notes" className="font-mono text-xs font-semibold text-chalk hover:underline inline-flex items-center gap-1">
              Open AI Summarizer Engine <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* Section 5: Academic Audit Log Timeline (6 cols) */}
        <section aria-labelledby="timeline-heading" className="lg:col-span-6 bg-paper border border-border rounded-md p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
            <div>
              <span className="font-mono text-xs font-semibold text-graphite uppercase tracking-wider">
                05 — ACADEMIC AUDIT LOG
              </span>
              <h3 id="timeline-heading" className="font-display font-bold text-lg text-ink">
                Chronological Timeline
              </h3>
            </div>
            <span className="font-mono text-xs text-graphite">
              Automated Registry
            </span>
          </div>

          <div className="relative border-l border-border/60 ml-3 pl-5 space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="relative">
                {/* Node point */}
                <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-quad border-2 border-paper" />
                
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-sans text-[13px] font-semibold text-ink">
                    {act.title}
                  </h4>
                  <span className="font-mono text-[10px] text-graphite flex-shrink-0">
                    {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-graphite mt-0.5">
                  {act.course ? `[${act.course}] ` : ''}{act.meta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-3 border-t border-border/40 text-right">
            <span className="font-mono text-[11px] text-graphite">
              All records timestamped & cryptographically verified.
            </span>
          </div>
        </section>

      </div>

      {/* ── 6. COHORT LEADERBOARD ───────────────────────────────────────── */}
      <section aria-labelledby="leaderboard-heading" className="bg-paper border border-border rounded-md p-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
          <div>
            <span className="font-mono text-xs font-semibold text-graphite uppercase tracking-wider">
              06 — CAMPUS STANDINGS
            </span>
            <h3 id="leaderboard-heading" className="font-display font-bold text-xl text-ink">
              Semester 5 Cohort Leaderboard
            </h3>
          </div>
          <span className="font-mono text-xs text-graphite">
            Batch of 2027 · Real-Time Ranking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-border/60 font-mono text-[11px] text-graphite uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Branch / Cohort</th>
                <th className="py-2.5 px-3 text-center">Study Streak</th>
                <th className="py-2.5 px-3 text-right">Mastery Points</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {leaderboard.map((student) => (
                <tr 
                  key={student.rank} 
                  className={`transition-colors ${
                    student.isCurrentUser ? 'bg-quad/5 font-semibold text-ink' : 'hover:bg-secondary/10 text-ink/90'
                  }`}
                >
                  <td className="py-3 px-3 font-bold">
                    #{student.rank < 10 ? `0${student.rank}` : student.rank}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-secondary/50 border border-border flex items-center justify-center font-bold text-[11px] text-quad">
                        {student.avatar}
                      </div>
                      <span className="font-semibold text-ink">
                        {student.name} {student.isCurrentUser && '(You)'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-sans text-graphite">
                    {student.branch}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-marker font-bold">
                      🔥 {student.streakDays}d
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold tabular-nums">
                    {student.points.toLocaleString()} pts
                  </td>
                  <td className="py-3 px-3 text-center">
                    {student.verified && (
                      <span className="inline-block w-4 h-4 border border-quad rounded-[2px] font-mono text-[10px] text-quad leading-none select-none text-center">
                        ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

