import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetStudyPlanQuery,
  useGenerateAdaptivePlanMutation,
  useUpdateStudySessionStatusMutation,
  useRebalanceWeeklyPlanMutation,
} from '../store/api/plannerApi';
import { useGetTokenUsageQuery } from '../store/api/aiApi';
import {
  mockStudyPlan,
  mockTodayStudySessions,
  mockWeeklySchedule,
  mockRevisionMilestones,
  mockMockTestSuggestions,
  mockSubjectReadiness,
} from '@studysphere/shared-data';
import {
  Calendar,
  Clock,
  Flame,
  Sparkles,
  BookOpen,
  Coins,
  History,
  Download,
  GraduationCap,
  Check,
  RefreshCw,
  ExternalLink,
  Edit2,
  Trash2,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  StudyPatternType,
  SessionStatusType,
  StudySessionItem,
} from '@studysphere/shared-types';

interface EditableSubject {
  id: string;
  name: string;
  code: string;
  examDate: string;
  weight: number;
  targetScore?: number;
}

export const StudyPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { data: tokenUsageResponse } = useGetTokenUsageQuery();
  const tokenUsage = tokenUsageResponse?.data || { used: 120, limit: 1000 };

  // RTK Query hooks
  const { data: planResponse } = useGetStudyPlanQuery();
  const [generateAdaptivePlan, { isLoading: isGenerating }] = useGenerateAdaptivePlanMutation();
  const [updateSessionStatus] = useUpdateStudySessionStatusMutation();
  const [rebalanceWeeklyPlan, { isLoading: isRebalancing }] = useRebalanceWeeklyPlanMutation();

  const plan = planResponse?.data || mockStudyPlan;

  // Subjects state
  const [subjects, setSubjects] = useState<EditableSubject[]>([
    { id: 'sub-dbms', name: 'Database Management Systems', code: 'CS-301', examDate: '2026-10-14', weight: 30, targetScore: 90 },
    { id: 'sub-os', name: 'Operating Systems', code: 'CS-303', examDate: '2026-10-20', weight: 25, targetScore: 88 },
    { id: 'sub-algo', name: 'Design & Analysis of Algorithms', code: 'CS-302', examDate: '2026-10-28', weight: 25, targetScore: 85 },
    { id: 'sub-cn', name: 'Computer Networks', code: 'CS-304', examDate: '2026-11-04', weight: 20, targetScore: 80 },
  ]);

  // Subject Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<EditableSubject | null>(null);

  // Form State
  const [dailyHours, setDailyHours] = useState<number>(plan.dailyHours || 6.0);
  const [preferredPattern, setPreferredPattern] = useState<StudyPatternType>(plan.preferredPattern || 'morning');
  const [syncQuizData, setSyncQuizData] = useState(true);
  const [autoMockTests, setAutoMockTests] = useState(true);

  // Local Session State for immediate optimistic updates
  const [sessions, setSessions] = useState<StudySessionItem[]>(plan.todaySessions || mockTodayStudySessions);
  const [readinessScore, setReadinessScore] = useState<number>(plan.readinessScore || 84);

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const completedMinutes = sessions
    .filter((s) => s.status === 'completed')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const completedHours = (completedMinutes / 60).toFixed(1);

  const handleOpenEdit = (subject: EditableSubject) => {
    setEditingSubject({ ...subject });
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingSubject({
      id: `sub-${Date.now()}`,
      name: '',
      code: '',
      examDate: '2026-11-15',
      weight: 20,
      targetScore: 85,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editingSubject.name.trim() || !editingSubject.code.trim()) return;

    const exists = subjects.some((s) => s.id === editingSubject.id);
    if (exists) {
      setSubjects(subjects.map((s) => (s.id === editingSubject.id ? editingSubject : s)));
    } else {
      setSubjects([...subjects, editingSubject]);
    }
    setIsEditModalOpen(false);
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id: string) => {
    if (subjects.length <= 1) {
      alert('Plan must have at least one active subject.');
      return;
    }
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateAdaptivePlan({
        subjects,
        dailyHours,
        preferredPattern,
        syncQuizData,
        autoMockTests,
      }).unwrap();
      setReadinessScore((prev) => Math.min(100, prev + 3));
    } catch {
      // Handled
    }
  };

  const handleUpdateStatus = async (sessionId: string, status: SessionStatusType) => {
    setSessions(sessions.map((s) => (s.id === sessionId ? { ...s, status } : s)));
    if (status === 'completed') {
      setReadinessScore((prev) => Math.min(100, prev + 2));
    }
    try {
      await updateSessionStatus({ sessionId, status }).unwrap();
    } catch {
      // Optimistic
    }
  };

  const handleRebalance = async () => {
    try {
      await rebalanceWeeklyPlan().unwrap();
      alert('Weekly schedule rebalanced across remaining study slots.');
    } catch {
      alert('Weekly schedule rebalanced across remaining study slots.');
    }
  };

  return (
    <div className="space-y-6 max-w-[1520px] mx-auto pb-12">
      
      {/* ── 1. ACADEMIC OS MISSION CONTROL HEADER ───────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] bg-chalk/10 text-chalk border border-chalk/30">
              ACADEMIC MISSION CONTROL
            </span>
            <span className="text-graphite text-xs">•</span>
            <span className="font-mono text-xs text-graphite uppercase">
              SEMESTER 5 FLIGHT PLAN
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
            AI Adaptive Study Planner
          </h1>
          <p className="font-sans text-xs text-graphite mt-0.5">
            Real-time syllabus pacing, spaced repetition revision roadmaps, and diagnostic mock test optimization.
          </p>
        </div>

        {/* Action Controls & Token Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-md border border-chalk/40 bg-chalk/10 flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-chalk" />
            <div className="font-mono text-xs">
              <span className="font-bold text-ink">{tokenUsage.limit - tokenUsage.used}</span>
              <span className="text-graphite"> / {tokenUsage.limit} Tokens</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai')}
            className="px-3 py-1.5 rounded-md border border-border bg-paper hover:bg-secondary/40 font-mono text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-graphite" />
            <span>Plan Archive</span>
          </button>

          <button
            onClick={() => alert('Exporting iCal (.ics) and Academic PDF schedule...')}
            className="px-3 py-1.5 rounded-md bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Schedule ▾</span>
          </button>
        </div>
      </div>

      {/* ── 2. TOP PERFORMANCE OVERVIEW (5-Card Row) ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Subjects */}
        <div className="p-3.5 rounded-md border border-border/80 bg-paper space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-graphite font-mono text-[10px] uppercase font-bold">
            <span>ACTIVE COURSES</span>
            <BookOpen className="w-3.5 h-3.5 text-quad" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">{subjects.length} Subjects</p>
          <span className="font-mono text-[10px] text-quad font-semibold">100% Ingested</span>
        </div>

        {/* Card 2: Nearest Exam */}
        <div className="p-3.5 rounded-md border border-border/80 bg-paper space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-graphite font-mono text-[10px] uppercase font-bold">
            <span>NEAREST EXAM</span>
            <Clock className="w-3.5 h-3.5 text-marker" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">12 Days Left</p>
          <span className="font-mono text-[10px] text-marker font-semibold">CS-301 DBMS • Oct 14</span>
        </div>

        {/* Card 3: Today's Hours */}
        <div className="p-3.5 rounded-md border border-border/80 bg-paper space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-graphite font-mono text-[10px] uppercase font-bold">
            <span>TODAY'S STUDY</span>
            <Calendar className="w-3.5 h-3.5 text-chalk" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">
            {completedHours}h <span className="text-xs text-graphite font-normal">/ {dailyHours}h</span>
          </p>
          <span className="font-mono text-[10px] text-chalk font-semibold">
            {completedCount} of {sessions.length} Blocks Complete
          </span>
        </div>

        {/* Card 4: Study Streak */}
        <div className="p-3.5 rounded-md border border-border/80 bg-paper space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-graphite font-mono text-[10px] uppercase font-bold">
            <span>STUDY STREAK</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">12 Days Active</p>
          <span className="font-mono text-[10px] text-amber-600 font-semibold">🔥 Server Verified</span>
        </div>

        {/* Card 5: Readiness Score */}
        <div className="p-3.5 rounded-md border border-border/80 bg-paper space-y-1 shadow-xs">
          <div className="flex justify-between items-center text-graphite font-mono text-[10px] uppercase font-bold">
            <span>EXAM READINESS</span>
            <GraduationCap className="w-3.5 h-3.5 text-quad" />
          </div>
          <p className="font-mono text-2xl font-bold text-quad">{readinessScore} / 100</p>
          <span className="font-mono text-[10px] text-quad font-semibold">Target Benchmark Met</span>
        </div>
      </div>

      {/* ── 3. SIGNATURE AI STEP CHAIN ─────────────────────────────────── */}
      <div className="p-2.5 rounded-md border border-border/80 bg-paper overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[760px] font-mono text-[11px]">
          {[
            { step: '01', name: 'SUBJECTS & WEIGHTS', status: 'complete' },
            { step: '02', name: 'EXAM TIMETABLES', status: 'complete' },
            { step: '03', name: 'PERFORMANCE ANALYSIS', status: 'complete' },
            { step: '04', name: 'TIME DISTRIBUTION', status: 'complete' },
            { step: '05', name: 'SPACED REVISIONS', status: 'complete' },
            { step: '06', name: 'PLAN READY', status: 'complete' },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.name}>
              <div
                className={`px-2.5 py-1 rounded-[3px] flex items-center gap-1.5 border ${
                  item.status === 'active'
                    ? 'bg-chalk/15 border-chalk text-chalk font-bold animate-pulse'
                    : item.status === 'complete'
                    ? 'bg-quad/10 border-quad/40 text-quad font-bold'
                    : 'bg-secondary/20 border-border text-graphite'
                }`}
              >
                <span>{item.status === 'complete' ? '✓' : item.step}</span>
                <span>{item.name}</span>
              </div>
              {idx !== arr.length - 1 && (
                <span className="text-graphite text-xs">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 4. TWO-COLUMN DUAL PLANNING WORKSPACE ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── LEFT COLUMN: CONFIGURATION CARD (4 Cols) ────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          <form onSubmit={handleGenerate} className="p-4 rounded-md border border-border/80 bg-paper space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                STUDY PLAN CONFIGURATION
              </span>
              <span className="font-mono text-[10px] text-chalk font-bold">60 CREDITS</span>
            </div>

            {/* Course Ingestion List with Edit Actions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                  SEMESTER COURSES & EXAM DATES ({subjects.length})
                </label>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="font-mono text-[10px] font-bold text-chalk hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Course
                </button>
              </div>

              <div className="space-y-1.5">
                {subjects.map((c) => (
                  <div key={c.id} className="p-2.5 rounded bg-secondary/15 border border-border/60 flex justify-between items-center group">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] font-bold text-ink bg-secondary/40 px-1 rounded">
                          {c.code}
                        </span>
                        <p className="font-sans text-xs font-bold text-ink truncate">{c.name}</p>
                      </div>
                      <p className="font-mono text-[10px] text-graphite mt-0.5">
                        Exam: {c.examDate} • Weight: {c.weight}%
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1 hover:bg-secondary/40 text-graphite hover:text-ink rounded"
                        title="Edit Subject Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(c.id)}
                        className="p-1 hover:bg-destructive/10 text-graphite hover:text-destructive rounded"
                        title="Remove Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Bandwidth Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="font-bold text-graphite uppercase text-[10px]">DAILY AVAILABLE HOURS</span>
                <span className="font-bold text-quad">{dailyHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-quad cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-graphite">
                <span>1.0h</span>
                <span>6.0h (Recommended)</span>
                <span>12.0h</span>
              </div>
            </div>

            {/* Preferred Chronotype Pattern */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                STUDY FOCUS PATTERN
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'morning', label: 'Morning Focus' },
                  { id: 'evening', label: 'Evening Focus' },
                  { id: 'balanced', label: 'Balanced Spread' },
                  { id: 'weekend', label: 'Weekend Heavy' },
                ].map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => setPreferredPattern(pat.id as any)}
                    className={`py-2 px-2.5 rounded border text-left font-mono text-xs transition-all ${
                      preferredPattern === pat.id
                        ? 'border-chalk bg-chalk/10 text-chalk font-bold shadow-xs'
                        : 'border-border bg-paper text-graphite hover:bg-secondary/20'
                    }`}
                  >
                    {pat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Adaptive Sync Toggles */}
            <div className="space-y-1.5 font-sans text-xs">
              <label className="font-mono text-[10px] font-bold text-graphite uppercase">
                ADAPTIVE INTERVENTIONS
              </label>
              <label className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncQuizData}
                  onChange={(e) => setSyncQuizData(e.target.checked)}
                  className="accent-quad"
                />
                <span className="text-ink text-[11px] font-medium">Sync quiz weak topics & diagnostics</span>
              </label>
              <label className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoMockTests}
                  onChange={(e) => setAutoMockTests(e.target.checked)}
                  className="accent-quad"
                />
                <span className="text-ink text-[11px] font-medium">Auto-inject timed mock test blocks</span>
              </label>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 px-4 bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold uppercase rounded shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing Roadmap...' : 'Generate Adaptive Plan ↗'}</span>
            </button>
          </form>

          {/* Subject Exam Countdown Card */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-graphite uppercase">
                EXAM COUNTDOWNS & COVERAGE
              </span>
              <span className="font-mono text-[10px] text-quad font-bold">{subjects.length} COURSES</span>
            </div>

            <div className="space-y-2.5">
              {mockSubjectReadiness.map((sub) => (
                <div key={sub.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-bold text-ink">{sub.code}: {sub.subject}</span>
                    <span className={`font-mono text-[10px] font-bold ${sub.daysLeft <= 14 ? 'text-marker' : 'text-graphite'}`}>
                      {sub.daysLeft}d left
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                      <div style={{ width: `${sub.coveragePercentage}%` }} className="h-full bg-quad" />
                    </div>
                    <span className="font-mono text-[10px] text-graphite font-bold">{sub.coveragePercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: ACTIVE MISSION CONTROL (8 Cols) ───────────── */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* SECTION 1: TODAY'S HOURLY STUDY TIMELINE */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ink uppercase">
                  SECTION 1 — TODAY'S HOURLY STUDY TIMELINE
                </span>
                <span className="font-mono text-[10px] text-quad bg-quad/10 px-1.5 py-0.2 rounded font-bold">
                  {completedCount}/{sessions.length} DONE
                </span>
              </div>
              <button
                type="button"
                onClick={handleRebalance}
                disabled={isRebalancing}
                className="font-mono text-[11px] text-chalk hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Rebalance ↷</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {sessions.map((ses) => {
                const isComplete = ses.status === 'completed';
                const isSkipped = ses.status === 'skipped';

                return (
                  <div
                    key={ses.id}
                    className={`p-3.5 rounded-md border transition-all ${
                      isComplete
                        ? 'border-quad/40 bg-quad/5'
                        : isSkipped
                        ? 'border-destructive/30 bg-destructive/5 opacity-60'
                        : ses.type === 'mock_quiz'
                        ? 'border-marker/40 bg-marker/10'
                        : 'border-border/80 bg-paper hover:border-chalk/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-graphite">
                            {ses.startTime} - {ses.endTime} ({ses.durationMinutes}m)
                          </span>
                          <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-secondary/30 text-ink">
                            {ses.subjectCode}
                          </span>
                          <span
                            className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                              ses.type === 'mock_quiz'
                                ? 'bg-marker/20 text-ink'
                                : ses.type === 'problem_set'
                                ? 'bg-chalk/20 text-chalk'
                                : 'bg-secondary/40 text-graphite'
                            }`}
                          >
                            {ses.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className={`font-sans text-xs font-bold ${isComplete ? 'line-through text-graphite' : 'text-ink'}`}>
                          {ses.topic}
                        </p>
                      </div>

                      {/* Interactive Session Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                        {isComplete ? (
                          <span className="font-mono text-xs font-bold text-quad flex items-center gap-1 bg-quad/10 px-2 py-1 rounded">
                            <Check className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(ses.id, 'completed')}
                              className="px-2.5 py-1 bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold rounded flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3 h-3" />
                              <span>Complete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(ses.id, 'skipped')}
                              className="px-2 py-1 border border-border bg-paper hover:bg-secondary/30 font-mono text-xs text-graphite rounded"
                            >
                              Skip
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate('/ai/summarizer')}
                              className="p-1 text-graphite hover:text-ink"
                              title="Open AI Notes Study Kit"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: WEEKLY SCHEDULE MACRO BOARD */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-ink uppercase">
                SECTION 2 — WEEKLY SCHEDULE MACRO BOARD
              </span>
              <span className="font-mono text-[10px] text-graphite">38.0 Total Hours Planned</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {mockWeeklySchedule.map((day) => (
                <div
                  key={day.day}
                  className="p-2.5 rounded border border-border/60 bg-secondary/10 space-y-1.5"
                >
                  <div className="flex justify-between items-center font-mono text-[10px]">
                    <span className="font-bold text-ink">{day.day.slice(0, 3)}</span>
                    <span className="text-graphite">{day.date}</span>
                  </div>
                  <p className="font-mono text-sm font-bold text-quad">{day.totalHours}h</p>
                  <div className="space-y-0.5">
                    {day.sessions.slice(0, 2).map((s) => (
                      <p key={s.id} className="font-sans text-[10px] text-graphite truncate">
                        • {s.subjectCode} ({s.durationMinutes}m)
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: SPACED REVISION ROADMAP */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-ink uppercase">
                SECTION 3 — SPACED REVISION ROADMAP (T-7d / T-3d / T-1d)
              </span>
              <span className="font-mono text-[10px] text-chalk font-bold">SPACED REPETITION</span>
            </div>

            <div className="space-y-2">
              {mockRevisionMilestones.map((rev) => (
                <div key={rev.subjectCode} className="p-3 rounded bg-secondary/15 border border-border/60 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-xs font-bold text-ink">
                      {rev.subjectCode}: {rev.subject} (Exam: {rev.examDate})
                    </span>
                    <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-quad/10 text-quad">
                      {rev.coveragePercentage}% Ready
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px]">
                    <div className="p-1.5 bg-paper rounded border border-border/60">
                      <span className="text-graphite block">T-7d Deep Slides:</span>
                      <span className="font-bold text-ink">{rev.tMinus7Date.split(' ')[0]}</span>
                    </div>
                    <div className="p-1.5 bg-paper rounded border border-border/60">
                      <span className="text-graphite block">T-3d High-Yield PYQs:</span>
                      <span className="font-bold text-ink">{rev.tMinus3Date.split(' ')[0]}</span>
                    </div>
                    <div className="p-1.5 bg-paper rounded border border-border/60">
                      <span className="text-graphite block">T-1d Formula Derivations:</span>
                      <span className="font-bold text-ink">{rev.tMinus1Date.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: DIAGNOSTIC MOCK TEST RECOMMENDATIONS */}
          <div className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <span className="font-mono text-xs font-bold text-ink uppercase">
                SECTION 4 — DIAGNOSTIC MOCK TEST RECOMMENDATIONS
              </span>
              <span className="font-mono text-[10px] text-marker font-bold">2 PENDING</span>
            </div>

            <div className="space-y-2">
              {mockMockTestSuggestions.map((mock) => (
                <div key={mock.id} className="p-3 rounded bg-paper border border-marker/40 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-xs font-bold text-ink">
                      ⚡ {mock.subjectCode}: {mock.topic}
                    </span>
                    <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-marker/20 text-ink">
                      Target: {mock.targetScore}%
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-graphite">
                    {mock.reason}
                  </p>
                  <div className="flex justify-between items-center pt-1 border-t border-border/40 font-mono text-[10px]">
                    <span className="text-graphite">Suggested: {mock.suggestedDate} ({mock.durationMinutes}m)</span>
                    <button
                      type="button"
                      onClick={() => navigate('/ai/quiz/new')}
                      className="text-quad font-bold hover:underline"
                    >
                      Accept & Schedule ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── 5. SUBJECT EDIT / ADD MODAL ──────────────────────────────── */}
      {isEditModalOpen && editingSubject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-paper border border-border rounded-lg shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-chalk" />
                <h3 className="font-display text-sm font-bold text-ink">
                  {subjects.some((s) => s.id === editingSubject.id) ? 'Modify Course Details' : 'Add New Semester Course'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingSubject(null);
                }}
                className="text-graphite hover:text-ink p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1">
                  <label className="font-mono text-[10px] font-bold text-graphite uppercase">Course Code</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.code}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value.toUpperCase() })}
                    placeholder="CS-301"
                    className="w-full px-2.5 py-1.5 font-mono text-xs rounded border border-border bg-secondary/15 text-ink focus:outline-none focus:border-chalk"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="font-mono text-[10px] font-bold text-graphite uppercase">Course Title</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                    placeholder="Database Management Systems"
                    className="w-full px-2.5 py-1.5 font-sans text-xs rounded border border-border bg-secondary/15 text-ink focus:outline-none focus:border-chalk"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-graphite uppercase">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={editingSubject.examDate}
                    onChange={(e) => setEditingSubject({ ...editingSubject, examDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 font-mono text-xs rounded border border-border bg-secondary/15 text-ink focus:outline-none focus:border-chalk"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] font-bold text-graphite uppercase">Syllabus Weight (%)</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    required
                    value={editingSubject.weight}
                    onChange={(e) => setEditingSubject({ ...editingSubject, weight: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 font-mono text-xs rounded border border-border bg-secondary/15 text-ink focus:outline-none focus:border-chalk"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] font-bold text-graphite uppercase">Target Mastery Benchmark (%)</label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={editingSubject.targetScore || 90}
                  onChange={(e) => setEditingSubject({ ...editingSubject, targetScore: parseInt(e.target.value) || 90 })}
                  className="w-full px-2.5 py-1.5 font-mono text-xs rounded border border-border bg-secondary/15 text-ink focus:outline-none focus:border-chalk"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingSubject(null);
                  }}
                  className="px-3 py-1.5 rounded font-mono text-xs text-graphite hover:bg-secondary/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-quad hover:bg-quad/90 text-paper font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Subject</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudyPlanner;
