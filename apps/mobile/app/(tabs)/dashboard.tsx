import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetStudentDashboardQuery,
  useToggleTaskCompletionMutation,
} from '../../src/store/api/dashboardApi';
import { useAppSelector } from '../../src/store/hooks';
import {
  GraduationCap,
  Award,
  CheckSquare,
  Clock,
  Flame,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart2,
  TrendingUp,
} from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { DashboardTask } from '@studysphere/shared-data';
import { ThemeToggle } from '../../src/components/ThemeToggle';

export default function MobileDashboard() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  // Filter States
  const [selectedSemester, setSelectedSemester] = useState('Semester 5 (Active)');
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeChartTab, setActiveChartTab] = useState<'hours' | 'subjects' | 'accuracy'>('hours');
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);

  // RTK Query hooks
  const { data: dashboardResponse, isLoading, refetch } = useGetStudentDashboardQuery();
  const [toggleTask] = useToggleTaskCompletionMutation();

  const dashboardData = dashboardResponse?.data;
  const stats = dashboardData?.stats;
  const tasks = dashboardData?.tasks || [];
  const deadlines = dashboardData?.deadlines || [];
  const aiActivities = dashboardData?.aiActivities || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const leaderboard = dashboardData?.leaderboard || [];

  const currentRangeData = dashboardData?.analyticsByRange?.[selectedRange] || [
    { name: 'Mon', hours: 4.2, aiQueries: 12, quizScore: 92, codingMinutes: 45 },
    { name: 'Tue', hours: 5.1, aiQueries: 18, quizScore: 88, codingMinutes: 60 },
    { name: 'Wed', hours: 3.8, aiQueries: 8, quizScore: 95, codingMinutes: 30 },
    { name: 'Thu', hours: 6.0, aiQueries: 24, quizScore: 91, codingMinutes: 90 },
    { name: 'Fri', hours: 5.5, aiQueries: 20, quizScore: 89, codingMinutes: 75 },
    { name: 'Sat', hours: 7.2, aiQueries: 32, quizScore: 96, codingMinutes: 120 },
    { name: 'Sun', hours: 4.5, aiQueries: 14, quizScore: 90, codingMinutes: 60 },
  ];

  const totalHours = currentRangeData.reduce((acc, curr) => acc + curr.hours, 0);
  const totalAi = currentRangeData.reduce((acc, curr) => acc + curr.aiQueries, 0);
  const avgAccuracy = (currentRangeData.reduce((acc, curr) => acc + curr.quizScore, 0) / currentRangeData.length).toFixed(1);
  const totalCoding = currentRangeData.reduce((acc, curr) => acc + curr.codingMinutes, 0);

  const studyDist = dashboardData?.studyDistribution || [
    { category: 'Core CS Theory', hours: 20, percentage: 42, color: '#2f5d50' },
    { category: 'Algorithms & DSA', hours: 12, percentage: 26, color: '#5b7fde' },
    { category: 'AI Notes & Flashcards', hours: 9, percentage: 19, color: '#f2c14e' },
    { category: 'Placement Prep', hours: 6, percentage: 13, color: '#8a8d85' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleToggleTask = async (task: DashboardTask) => {
    try {
      await toggleTask({ taskId: task.id, completed: !task.completed }).unwrap();
    } catch {
      // Handled
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} />
        }
      >
        
        {/* ── 1. TOP MOBILE HEADER WITH SEMESTER SELECTOR ─────────────── */}
        <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-border/60">
          <View>
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <Text className="font-mono text-[10px] uppercase font-bold text-quad tracking-wider">
                ACADEMIC COCKPIT
              </Text>
              <Text className="text-graphite text-[10px]">•</Text>
              <TouchableOpacity
                onPress={() => setIsSemesterModalOpen(true)}
                className="flex-row items-center gap-1"
              >
                <Text className="font-mono text-[10px] text-chalk uppercase font-bold">
                  {selectedSemester} ▾
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="font-sans text-xl font-bold text-ink">
              {user?.name || 'Sneha Patel'}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <ThemeToggle size={13} className="w-7 h-7" />
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/more' as Href)}
              className="w-8 h-8 rounded-full bg-secondary/50 border border-border items-center justify-center"
            >
              <Text className="font-sans font-bold text-quad text-xs">
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 2. STREAK & AI TOKEN STATUS BANNER ──────────────────────── */}
        <View className="p-3.5 rounded-md border border-quad/40 bg-quad/10 mb-4">
          <View className="flex-row justify-between items-center mb-1.5">
            <View className="flex-row items-center gap-1.5 bg-quad/20 px-2 py-0.5 rounded-[4px]">
              <Flame size={12} color="#f2c14e" />
              <Text className="font-mono text-xs font-bold text-ink">
                {stats?.studyStreakDays || 12} DAY STREAK
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Sparkles size={11} color="#5b7fde" />
              <Text className="font-mono text-[10px] text-graphite">
                {stats?.aiTokensRemaining || 880} tokens left
              </Text>
            </View>
          </View>
          <Text className="font-sans text-xs font-bold text-ink">
            Semester 5 Academic Ledger Synced
          </Text>
          <Text className="font-sans text-[11px] text-graphite mt-0.5 leading-relaxed">
            Attendance standing is 89.5% (Safe). All 4 deadlines registered.
          </Text>
        </View>

        {/* ── 3. ACADEMIC SNAPSHOT METRICS CAROUSEL ───────────────────── */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
              01 — ACADEMIC PERFORMANCE SNAPSHOT
            </Text>
            <Text className="font-mono text-[9px] text-quad">✓ VERIFIED</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {/* Card 1: CGPA */}
            <View className="w-32 p-3 rounded-md bg-paper border border-border/80 justify-between shadow-xs">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-mono text-[9px] font-bold text-graphite uppercase">CGPA</Text>
                <GraduationCap size={13} color="#2f5d50" />
              </View>
              <Text className="font-mono text-xl font-bold text-ink leading-tight">
                {stats?.cgpa.toFixed(2) || '9.12'}
              </Text>
              <Text className="font-mono text-[9px] text-quad mt-1">{stats?.cgpaDelta || '+0.24'}</Text>
            </View>

            {/* Card 2: Attendance */}
            <View className="w-32 p-3 rounded-md bg-paper border border-border/80 justify-between shadow-xs">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-mono text-[9px] font-bold text-graphite uppercase">ATTENDANCE</Text>
                <CheckSquare size={13} color="#2f5d50" />
              </View>
              <Text className="font-mono text-xl font-bold text-ink leading-tight">
                {stats?.attendancePercentage || 89.5}%
              </Text>
              <Text className="font-mono text-[9px] text-quad mt-1">SAFE (&gt;75%)</Text>
            </View>

            {/* Card 3: Quiz Avg */}
            <View className="w-32 p-3 rounded-md bg-paper border border-border/80 justify-between shadow-xs">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-mono text-[9px] font-bold text-graphite uppercase">QUIZ AVG</Text>
                <Award size={13} color="#2f5d50" />
              </View>
              <Text className="font-mono text-xl font-bold text-ink leading-tight">
                {stats?.quizAverage || 91.4}%
              </Text>
              <Text className="font-mono text-[9px] text-graphite mt-1">{stats?.completedQuizzes || 14} logged</Text>
            </View>

            {/* Card 4: Assignments */}
            <View className="w-32 p-3 rounded-md bg-paper border border-border/80 justify-between shadow-xs">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-mono text-[9px] font-bold text-graphite uppercase">SUBMISSIONS</Text>
                <Clock size={13} color="#f2c14e" />
              </View>
              <Text className="font-mono text-xl font-bold text-ink leading-tight">
                {stats?.completedAssignments || 14}/{stats?.totalAssignments || 16}
              </Text>
              <Text className="font-mono text-[9px] text-destructive mt-1">2 Due soon</Text>
            </View>
          </ScrollView>
        </View>

        {/* ── 4. ANALYTICAL ENGINE CANVAS & TELEMETRY ─────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper mb-4 space-y-3 shadow-xs">
          <View className="flex-row justify-between items-center pb-2 border-b border-border/60">
            <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
              02 — STUDY TELEMETRY
            </Text>
            
            {/* Range Pills */}
            <View className="flex-row bg-secondary/30 p-0.5 rounded-[4px]">
              {(['7d', '30d', '90d', '1y'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setSelectedRange(r)}
                  className={`px-1.5 py-0.5 rounded-[2px] ${
                    selectedRange === r ? 'bg-quad' : ''
                  }`}
                >
                  <Text
                    className={`font-mono text-[8px] uppercase ${
                      selectedRange === r ? 'text-paper font-bold' : 'text-graphite'
                    }`}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chart View Switcher Tabs */}
          <View className="flex-row gap-1 p-0.5 bg-secondary/20 rounded border border-border/60">
            {[
              { id: 'hours', label: 'Study Hours & AI' },
              { id: 'subjects', label: 'Subject Scores' },
              { id: 'accuracy', label: 'Topic Accuracy' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveChartTab(tab.id as any)}
                className={`flex-1 py-1 rounded items-center ${
                  activeChartTab === tab.id
                    ? 'bg-paper shadow-xs border border-border/60'
                    : ''
                }`}
              >
                <Text
                  className={`font-mono text-[9px] font-bold ${
                    activeChartTab === tab.id ? 'text-ink' : 'text-graphite'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 4 Multi-Range Metrics Grid */}
          <View className="flex-row gap-2">
            <View className="flex-1 p-2 bg-secondary/15 rounded">
              <Text className="font-mono text-[8px] text-graphite uppercase">HOURS STUDIED</Text>
              <Text className="font-mono text-sm font-bold text-ink mt-0.5">{totalHours.toFixed(1)}h</Text>
            </View>
            <View className="flex-1 p-2 bg-secondary/15 rounded">
              <Text className="font-mono text-[8px] text-graphite uppercase">AI INFERENCES</Text>
              <Text className="font-mono text-sm font-bold text-chalk mt-0.5">{totalAi} ops</Text>
            </View>
            <View className="flex-1 p-2 bg-secondary/15 rounded">
              <Text className="font-mono text-[8px] text-graphite uppercase">ACCURACY</Text>
              <Text className="font-mono text-sm font-bold text-quad mt-0.5">{avgAccuracy}%</Text>
            </View>
            <View className="flex-1 p-2 bg-secondary/15 rounded">
              <Text className="font-mono text-[8px] text-graphite uppercase">DSA CODE</Text>
              <Text className="font-mono text-sm font-bold text-ink mt-0.5">{totalCoding}m</Text>
            </View>
          </View>

          {/* Visual Chart Rendering based on Active Tab */}
          {activeChartTab === 'hours' ? (
            <View className="space-y-1.5 pt-1">
              <Text className="font-mono text-[9px] text-graphite uppercase font-bold">
                WEEKLY STUDY ACTIVITY BREAKDOWN
              </Text>
              <View className="space-y-1">
                {currentRangeData.slice(0, 5).map((d) => (
                  <View key={d.name} className="flex-row items-center gap-2">
                    <Text className="font-mono text-[10px] text-graphite w-7">{d.name}</Text>
                    <View className="flex-1 h-2 bg-secondary/30 rounded-full overflow-hidden flex-row">
                      <View style={{ width: `${(d.hours / 8) * 100}%` }} className="h-full bg-quad" />
                    </View>
                    <Text className="font-mono text-[10px] text-ink font-bold w-10 text-right">
                      {d.hours}h
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : activeChartTab === 'subjects' ? (
            <View className="space-y-1.5 pt-1">
              <Text className="font-mono text-[9px] text-graphite uppercase font-bold">
                CORE SUBJECT MASTERY VS ATTENDANCE
              </Text>
              {[
                { label: 'DBMS (CS-301)', score: 94, attendance: 92, color: '#2f5d50' },
                { label: 'OS (CS-303)', score: 91, attendance: 88, color: '#2f5d50' },
                { label: 'Algorithms (CS-302)', score: 88, attendance: 90, color: '#5b7fde' },
                { label: 'Computer Networks (CS-304)', score: 82, attendance: 85, color: '#f2c14e' },
              ].map((subj) => (
                <View key={subj.label} className="space-y-0.5">
                  <View className="flex-row justify-between">
                    <Text className="font-sans text-[10px] font-bold text-ink">{subj.label}</Text>
                    <Text className="font-mono text-[9px] font-bold text-ink">{subj.score}% Score</Text>
                  </View>
                  <View className="w-full h-1.5 bg-secondary/40 rounded-full overflow-hidden">
                    <View style={{ width: `${subj.score}%`, backgroundColor: subj.color }} className="h-full rounded-full" />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="space-y-1.5 pt-1">
              <Text className="font-mono text-[9px] text-graphite uppercase font-bold">
                TOPIC ACCURACY VS 90% TARGET
              </Text>
              {[
                { topic: 'Relational Normalization', actual: 96, target: 90 },
                { topic: 'Virtual Memory Paging', actual: 92, target: 90 },
                { topic: 'Dynamic Programming', actual: 86, target: 90 },
                { topic: 'TCP Flow Control', actual: 78, target: 90 },
              ].map((t) => (
                <View key={t.topic} className="space-y-0.5">
                  <View className="flex-row justify-between">
                    <Text className="font-sans text-[10px] text-ink">{t.topic}</Text>
                    <Text className={`font-mono text-[9px] font-bold ${t.actual >= 90 ? 'text-quad' : 'text-marker'}`}>
                      {t.actual}% ({t.actual >= 90 ? '✓ Target Met' : 'Review Needed'})
                    </Text>
                  </View>
                  <View className="w-full h-1.5 bg-secondary/40 rounded-full overflow-hidden">
                    <View style={{ width: `${t.actual}%` }} className={`h-full ${t.actual >= 90 ? 'bg-quad' : 'bg-marker'}`} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Study Focus Distribution Stacked Progress Bar */}
          <View className="pt-2 border-t border-border/40 space-y-1">
            <View className="flex-row justify-between items-center">
              <Text className="font-mono text-[9px] uppercase font-bold text-graphite">
                FOCUS DISTRIBUTION
              </Text>
              <Text className="font-mono text-[9px] text-ink font-semibold">100% Tracked</Text>
            </View>

            <View className="w-full h-1.5 rounded-full flex-row overflow-hidden bg-secondary/30">
              {studyDist.map((item) => (
                <View
                  key={item.category}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  className="h-full"
                />
              ))}
            </View>

            <View className="flex-row flex-wrap gap-x-2 gap-y-0.5 pt-0.5">
              {studyDist.map((item) => (
                <View key={item.category} className="flex-row items-center gap-1">
                  <View style={{ backgroundColor: item.color }} className="w-1.5 h-1.5 rounded-full" />
                  <Text className="font-mono text-[8px] text-graphite">
                    {item.category} ({item.percentage}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 5. TODAY'S TASKS LEDGER ─────────────────────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper mb-4 shadow-xs">
          <View className="flex-row justify-between items-center mb-2.5 pb-2 border-b border-border/60">
            <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
              03 — TODAY'S TASKS
            </Text>
            <Text className="font-mono text-[10px] text-graphite">
              {tasks.filter((t) => t.completed).length}/{tasks.length} Done
            </Text>
          </View>

          <View className="space-y-1.5">
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => handleToggleTask(task)}
                className={`p-2 rounded-md border flex-row items-center justify-between ${
                  task.completed
                    ? 'bg-secondary/20 border-border/40 opacity-70'
                    : 'bg-paper border-border/80'
                }`}
              >
                <View className="flex-row items-center gap-2 flex-1 pr-2">
                  <View
                    className={`w-4 h-4 rounded-[2px] border items-center justify-center ${
                      task.completed ? 'border-quad bg-quad' : 'border-border'
                    }`}
                  >
                    {task.completed && <Text className="text-paper text-[10px] font-bold">✓</Text>}
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-sans text-xs font-medium ${
                        task.completed ? 'line-through text-graphite' : 'text-ink'
                      }`}
                      numberOfLines={1}
                    >
                      {task.title}
                    </Text>
                    <Text className="font-mono text-[9px] text-graphite">
                      {task.course} · {task.dueTime}
                    </Text>
                  </View>
                </View>

                <View
                  className={`px-1.5 py-0.2 rounded ${
                    task.priority === 'urgent'
                      ? 'bg-destructive/10'
                      : task.priority === 'high'
                      ? 'bg-marker/20'
                      : 'bg-secondary/40'
                  }`}
                >
                  <Text
                    className={`font-mono text-[8px] uppercase font-bold ${
                      task.priority === 'urgent'
                        ? 'text-destructive'
                        : task.priority === 'high'
                        ? 'text-ink'
                        : 'text-graphite'
                    }`}
                  >
                    {task.priority}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 6. UPCOMING DEADLINES & TIMETABLE ────────────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper mb-4 shadow-xs">
          <View className="flex-row justify-between items-center mb-2.5 pb-2 border-b border-border/60">
            <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
              TIMETABLE & AUDIT
            </Text>
            <Text className="font-mono text-[10px] text-destructive">4 Pending</Text>
          </View>

          <View className="space-y-1.5">
            {deadlines.map((dl) => (
              <View
                key={dl.id}
                className="p-2 rounded-md border border-border/60 bg-paper flex-row justify-between items-center"
              >
                <View className="flex-1 pr-2">
                  <Text className="font-mono text-[8px] uppercase text-graphite">
                    {dl.course}
                  </Text>
                  <Text className="font-sans text-xs font-semibold text-ink" numberOfLines={1}>
                    {dl.title}
                  </Text>
                  <Text className="font-mono text-[9px] text-graphite">Due: {dl.dueDate}</Text>
                </View>
                <View
                  className={`px-2 py-0.5 rounded ${
                    dl.hoursLeft <= 12 ? 'bg-destructive/10' : 'bg-secondary/40'
                  }`}
                >
                  <Text
                    className={`font-mono text-[9px] font-bold ${
                      dl.hoursLeft <= 12 ? 'text-destructive' : 'text-ink'
                    }`}
                  >
                    {dl.hoursLeft <= 24 ? `In ${dl.hoursLeft}h` : `${Math.round(dl.hoursLeft / 24)}d left`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── 7. SEMANTIC AI STACK TRANSFORMATIONS ─────────────────────── */}
        <View className="p-3.5 rounded-md border border-chalk/30 bg-chalk/5 mb-4 shadow-xs">
          <View className="flex-row justify-between items-center mb-2 pb-2 border-b border-chalk/20">
            <Text className="font-mono text-[10px] uppercase font-bold text-chalk tracking-wider">
              04 — SEMANTIC AI TRANSFORMATIONS
            </Text>
            <Sparkles size={12} color="#5b7fde" />
          </View>

          <View className="space-y-2">
            {aiActivities.slice(0, 2).map((act) => (
              <View key={act.id} className="p-2.5 bg-paper rounded border border-chalk/20 space-y-0.5">
                <View className="flex-row justify-between items-center">
                  <Text className="font-mono text-[8px] font-bold text-chalk uppercase">
                    {act.type}
                  </Text>
                  <Text className="font-mono text-[8px] text-graphite">{act.tokensUsed} TOKENS</Text>
                </View>
                <Text className="font-sans text-xs font-semibold text-ink" numberOfLines={1}>
                  {act.title}
                </Text>
                <Text className="font-sans text-[10px] text-graphite" numberOfLines={1}>
                  {act.action}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 8. ACADEMIC AUDIT LOG TIMELINE ──────────────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper mb-4 shadow-xs">
          <View className="flex-row justify-between items-center mb-2 pb-2 border-b border-border/60">
            <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
              05 — ACADEMIC AUDIT LOG
            </Text>
            <Text className="font-mono text-[9px] text-graphite">Automated Registry</Text>
          </View>

          <View className="space-y-2.5 pl-2 border-l border-border/60 ml-2">
            {recentActivities.slice(0, 3).map((act) => (
              <View key={act.id} className="space-y-0.5">
                <View className="flex-row justify-between items-center">
                  <Text className="font-sans text-xs font-semibold text-ink">{act.title}</Text>
                  <Text className="font-mono text-[8px] text-graphite">
                    {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                <Text className="font-mono text-[9px] text-graphite">
                  {act.course ? `[${act.course}] ` : ''}{act.meta}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 9. COHORT LEADERBOARD (HALL OF FAME) ────────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper mb-4 shadow-xs">
          <View className="flex-row justify-between items-center mb-2.5 pb-2 border-b border-border/60">
            <View className="flex-row items-center gap-1">
              <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
                06 — COHORT LEADERBOARD
              </Text>
              <Text className="font-mono text-[8px] text-quad font-bold">★ TOP SCHOLARS</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/resources' as Href)}>
              <Text className="font-mono text-[10px] text-quad font-bold">View All →</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-1.5">
            {leaderboard.slice(0, 4).map((entry) => (
              <View
                key={entry.rank}
                className={`p-2 rounded-md border flex-row items-center justify-between ${
                  entry.isCurrentUser
                    ? 'border-quad/60 bg-quad/10'
                    : 'border-border/60 bg-paper'
                }`}
              >
                <View className="flex-row items-center gap-2">
                  <View
                    className={`w-5 h-5 rounded-[2px] items-center justify-center border ${
                      entry.rank === 1
                        ? 'border-marker bg-marker/20'
                        : entry.rank === 2
                        ? 'border-border bg-secondary/30'
                        : 'border-border/60 bg-paper'
                    }`}
                  >
                    <Text className="font-mono text-[9px] font-bold text-ink">
                      #{entry.rank}
                    </Text>
                  </View>

                  <View>
                    <Text
                      className={`font-sans text-xs font-bold ${
                        entry.isCurrentUser ? 'text-quad' : 'text-ink'
                      }`}
                    >
                      {entry.name}
                    </Text>
                    <Text className="font-mono text-[8px] text-graphite">
                      {entry.rank <= 3 ? 'Honor Roll' : 'Contributor'}
                    </Text>
                  </View>
                </View>

                <Text className="font-mono text-[10px] font-bold text-ink">
                  {entry.points.toLocaleString()} pts
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 10. ACADEMIC AI SUITE LAUNCHPAD ─────────────────────────── */}
        <View className="p-3.5 rounded-md border border-chalk/40 bg-chalk/5 mb-4 space-y-2.5 shadow-xs">
          <View className="flex-row justify-between items-center pb-1.5 border-b border-chalk/20">
            <View className="flex-row items-center gap-1.5">
              <Sparkles size={12} color="#5b7fde" />
              <Text className="font-mono text-[10px] uppercase font-bold text-chalk tracking-wider">
                07 — AI RESEARCH LAUNCHPAD
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/ai' as Href)}>
              <Text className="font-mono text-[10px] text-chalk font-bold">All Tools (6) →</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push('/ai/summarizer' as Href)}
              className="flex-1 p-2.5 rounded bg-paper border border-border/80 space-y-0.5"
            >
              <Text className="font-sans text-xs font-bold text-ink">Summarizer</Text>
              <Text className="font-mono text-[8px] text-graphite">Study Kits & Formulas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/ai/quiz-setup' as Href)}
              className="flex-1 p-2.5 rounded bg-paper border border-border/80 space-y-0.5"
            >
              <Text className="font-sans text-xs font-bold text-ink">AI Quiz</Text>
              <Text className="font-mono text-[8px] text-graphite">Self-Testing Hall</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push('/ai/assignment-helper' as Href)}
              className="flex-1 p-2.5 rounded bg-paper border border-border/80 space-y-0.5"
            >
              <Text className="font-sans text-xs font-bold text-ink">Assignment Studio</Text>
              <Text className="font-mono text-[8px] text-graphite">Grammar & Citations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/resources' as Href)}
              className="flex-1 p-2.5 rounded bg-paper border border-border/80 space-y-0.5"
            >
              <Text className="font-sans text-xs font-bold text-ink">Resource Hub</Text>
              <Text className="font-mono text-[8px] text-graphite">PYQs & Lab Manuals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 11. BOTTOM NAVIGATION SHORTCUTS ─────────────────────────── */}
        <View className="flex-row gap-2 mb-8">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/coding' as Href)}
            className="flex-1 p-3 rounded bg-paper border border-border/80 flex-row items-center justify-between"
          >
            <View>
              <Text className="font-sans text-xs font-bold text-ink">Coding Hub</Text>
              <Text className="font-mono text-[9px] text-graphite">DSA & Contests</Text>
            </View>
            <ArrowRight size={13} color="#2f5d50" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/more' as Href)}
            className="flex-1 p-3 rounded bg-paper border border-border/80 flex-row items-center justify-between"
          >
            <View>
              <Text className="font-sans text-xs font-bold text-ink">Academic Profile</Text>
              <Text className="font-mono text-[9px] text-graphite">Credits & Ledger</Text>
            </View>
            <BookOpen size={13} color="#2f5d50" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Semester Picker Modal ───────────────────────────────────── */}
      <Modal visible={isSemesterModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <View className="w-full max-w-xs bg-paper rounded-lg border border-border p-4 space-y-2.5">
            <Text className="font-display text-sm font-bold text-ink pb-1 border-b border-border/60">
              Select Academic Semester
            </Text>
            {['Semester 5 (Active)', 'Semester 4 (Archived)', 'Semester 3 (Archived)'].map((sem) => (
              <TouchableOpacity
                key={sem}
                onPress={() => {
                  setSelectedSemester(sem);
                  setIsSemesterModalOpen(false);
                }}
                className={`p-2.5 rounded flex-row justify-between items-center ${
                  selectedSemester === sem ? 'bg-quad/10 border border-quad/40' : 'bg-secondary/15'
                }`}
              >
                <Text className={`font-sans text-xs font-semibold ${selectedSemester === sem ? 'text-quad' : 'text-ink'}`}>
                  {sem}
                </Text>
                {selectedSemester === sem && <CheckCircle2 size={14} color="#2f5d50" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
