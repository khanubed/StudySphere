import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useGetStudyPlanQuery,
  useGenerateAdaptivePlanMutation,
  useUpdateStudySessionStatusMutation,
  useRebalanceWeeklyPlanMutation,
} from '../../src/store/api/plannerApi';
import {
  mockStudyPlan,
  mockTodayStudySessions,
  mockWeeklySchedule,
  mockRevisionMilestones,
  mockMockTestSuggestions,
  mockSubjectReadiness,
} from '@studysphere/shared-data';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Coins,
  Check,
  RotateCcw,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Edit2,
  Trash2,
  Plus,
  X,
  Download,
} from 'lucide-react-native';
import {
  StudySessionItem,
  SessionStatusType,
  StudyPatternType,
} from '@studysphere/shared-types';


interface EditableSubject {
  id: string;
  name: string;
  code: string;
  examDate: string;
  weight: number;
  targetScore?: number;
}

export default function PlannerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'today' | 'subjects' | 'week' | 'revision' | 'mocks' | 'analytics'>('today');

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

  // Subject Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<EditableSubject | null>(null);

  // Form State
  const [dailyHours, setDailyHours] = useState<number>(plan.dailyHours || 6.0);
  const [preferredPattern, setPreferredPattern] = useState<StudyPatternType>(plan.preferredPattern || 'morning');
  const [syncQuizData, setSyncQuizData] = useState(true);
  const [autoMockTests, setAutoMockTests] = useState(true);

  // Local Session State
  const [sessions, setSessions] = useState<StudySessionItem[]>(plan.todaySessions || mockTodayStudySessions);
  const [readinessScore, setReadinessScore] = useState<number>(plan.readinessScore || 84);

  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  const handleOpenEdit = (subj: EditableSubject) => {
    setEditingSubject({ ...subj });
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

  const handleSaveSubject = () => {
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
      return;
    }
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleGenerate = async () => {
    try {
      await generateAdaptivePlan({
        subjects,
        dailyHours,
        preferredPattern,
        syncQuizData,
        autoMockTests,
      }).unwrap();
      setReadinessScore((prev) => Math.min(100, prev + 3));
      setActiveTab('today');
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
    } catch {
      // Optimistic
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-paper">
      
      {/* ── 1. Header with Token Pill & Actions ───────────────────────── */}
      <View className="px-4 py-3 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 p-1 rounded border border-border"
        >
          <ChevronLeft size={16} color="#12151c" />
          <Text className="font-mono text-xs font-semibold text-ink">Back</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="font-sans text-sm font-bold text-ink">Study Planner</Text>
          <Text className="font-mono text-[9px] text-graphite uppercase">Mission Control</Text>
        </View>

        <View className="flex-row items-center gap-1 bg-chalk/10 px-2 py-0.5 rounded border border-chalk/30">
          <Coins size={10} color="#5b7fde" />
          <Text className="font-mono text-[9px] font-bold text-chalk">880 cr</Text>
        </View>
      </View>


      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        
        {/* ── 2. Nearest Exam Alert Banner ─────────────────────────────── */}
        <View className="p-3.5 rounded-md border border-marker/40 bg-marker/10 flex-row justify-between items-center shadow-xs">
          <View className="space-y-0.5">
            <Text className="font-mono text-[9px] uppercase font-bold text-ink">
              NEAREST EXAM: CS-301 DBMS
            </Text>
            <Text className="font-sans text-xs font-bold text-ink">
              12 Days Remaining (Oct 14, 2026)
            </Text>
            <Text className="font-mono text-[10px] text-graphite">
              Today: {completedCount}/{sessions.length} Blocks Complete • {readinessScore}% Readiness
            </Text>
          </View>

          <View className="p-2 rounded bg-marker/20 border border-marker/40">
            <Clock size={16} color="#12151c" />
          </View>
        </View>

        {/* ── 3. Signature AI Step Chain (Horizontal Scroll) ─────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-1 py-1">
          {[
            { step: '01', name: 'SUBJECTS', status: 'complete' },
            { step: '02', name: 'EXAMS', status: 'complete' },
            { step: '03', name: 'ANALYSIS', status: 'complete' },
            { step: '04', name: 'DISTRIBUTION', status: 'complete' },
            { step: '05', name: 'REVISIONS', status: 'complete' },
            { step: '06', name: 'READY', status: 'complete' },
          ].map((item, idx, arr) => (
            <View key={item.name} className="flex-row items-center gap-1">
              <View className="px-2 py-0.5 rounded bg-quad/10 border border-quad/40 flex-row items-center gap-1">
                <Text className="font-mono text-[8px] font-bold text-quad">✓</Text>
                <Text className="font-mono text-[8px] font-bold text-quad">{item.name}</Text>
              </View>
              {idx !== arr.length - 1 && (
                <Text className="text-graphite text-[9px]">›</Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* ── 4. Segmented 6-Tab Selector ──────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-1 p-0.5 bg-secondary/20 rounded border border-border/60">
          {[
            { id: 'today', label: `Today (${completedCount}/${sessions.length})` },
            { id: 'subjects', label: `Subjects (${subjects.length})` },
            { id: 'week', label: 'Week (38h)' },
            { id: 'revision', label: 'Spaced' },
            { id: 'mocks', label: 'Mocks (2)' },
            { id: 'analytics', label: 'Readiness' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded items-center ${
                activeTab === tab.id
                  ? 'bg-paper shadow-xs border border-border/60'
                  : ''
              }`}
            >
              <Text
                className={`font-mono text-[9px] font-bold ${
                  activeTab === tab.id ? 'text-ink' : 'text-graphite'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── TAB 1: TODAY'S HOURLY TIMELINE ────────────────────────── */}
        {activeTab === 'today' && (
          <View className="space-y-2 pb-8">
            <View className="flex-row justify-between items-center px-1">
              <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
                HOURLY STUDY BLOCKS
              </Text>
              <TouchableOpacity onPress={handleRebalance} className="flex-row items-center gap-1">
                <RotateCcw size={10} color="#5b7fde" />
                <Text className="font-mono text-[9px] font-bold text-chalk">Rebalance ↷</Text>
              </TouchableOpacity>
            </View>

            {sessions.map((ses) => {
              const isComplete = ses.status === 'completed';
              const isSkipped = ses.status === 'skipped';

              return (
                <View
                  key={ses.id}
                  className={`p-3 rounded-md border space-y-2 ${
                    isComplete
                      ? 'border-quad/40 bg-quad/5'
                      : isSkipped
                      ? 'border-destructive/30 bg-destructive/5 opacity-60'
                      : ses.type === 'mock_quiz'
                      ? 'border-marker/40 bg-marker/10'
                      : 'border-border/80 bg-paper'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="font-mono text-xs font-bold text-graphite">
                        {ses.startTime} - {ses.endTime}
                      </Text>
                      <Text className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-secondary/30 text-ink">
                        {ses.subjectCode}
                      </Text>
                    </View>
                    <Text
                      className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        ses.type === 'mock_quiz' ? 'bg-marker/20 text-ink' : 'bg-chalk/20 text-chalk'
                      }`}
                    >
                      {ses.type.replace('_', ' ')}
                    </Text>
                  </View>

                  <Text className={`font-sans text-xs font-bold ${isComplete ? 'line-through text-graphite' : 'text-ink'}`}>
                    {ses.topic}
                  </Text>

                  {/* Actions */}
                  <View className="flex-row justify-between items-center pt-1 border-t border-border/40">
                    <TouchableOpacity
                      onPress={() => router.push('/ai/summarizer')}
                      className="flex-row items-center gap-1"
                    >
                      <ExternalLink size={11} color="#8a8d85" />
                      <Text className="font-mono text-[9px] text-graphite font-semibold">Open Study Kit</Text>
                    </TouchableOpacity>

                    {isComplete ? (
                      <Text className="font-mono text-[10px] font-bold text-quad">Completed ✓</Text>
                    ) : (
                      <View className="flex-row gap-1.5">
                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(ses.id, 'skipped')}
                          className="px-2 py-0.5 rounded border border-border bg-paper"
                        >
                          <Text className="font-mono text-[9px] text-graphite">Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(ses.id, 'completed')}
                          className="px-2.5 py-0.5 rounded bg-quad"
                        >
                          <Text className="font-mono text-[9px] font-bold text-paper">Complete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── TAB 2: SUBJECTS & STUDY CONFIGURATION ──────────────────── */}
        {activeTab === 'subjects' && (
          <View className="space-y-3 pb-8">
            <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
              <View className="flex-row justify-between items-center pb-1.5 border-b border-border/60">
                <Text className="font-mono text-[10px] uppercase font-bold text-graphite">
                  SEMESTER COURSES ({subjects.length})
                </Text>
                <TouchableOpacity onPress={handleOpenAdd} className="flex-row items-center gap-1">
                  <Plus size={12} color="#5b7fde" />
                  <Text className="font-mono text-[10px] font-bold text-chalk">Add Course</Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-2">
                {subjects.map((c) => (
                  <View key={c.id} className="p-2.5 rounded bg-secondary/15 border border-border/60 flex-row justify-between items-center">
                    <View className="flex-1 pr-2">
                      <View className="flex-row items-center gap-1">
                        <Text className="font-mono text-[9px] font-bold text-ink bg-secondary/40 px-1 rounded">
                          {c.code}
                        </Text>
                        <Text className="font-sans text-xs font-bold text-ink" numberOfLines={1}>
                          {c.name}
                        </Text>
                      </View>
                      <Text className="font-mono text-[9px] text-graphite mt-0.5">
                        Exam: {c.examDate} • Weight: {c.weight}%
                      </Text>
                    </View>

                    <View className="flex-row gap-1.5">
                      <TouchableOpacity
                        onPress={() => handleOpenEdit(c)}
                        className="p-1 rounded bg-paper border border-border"
                      >
                        <Edit2 size={12} color="#12151c" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteSubject(c.id)}
                        className="p-1 rounded bg-paper border border-border"
                      >
                        <Trash2 size={12} color="#d9534f" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Daily Hours Bandwidth */}
            <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2 shadow-xs">
              <View className="flex-row justify-between items-center">
                <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
                  DAILY STUDY BANDWIDTH
                </Text>
                <Text className="font-mono text-xs font-bold text-quad">{dailyHours} Hours / Day</Text>
              </View>

              <View className="flex-row gap-1.5">
                {[3, 4.5, 6, 8, 10].map((hrs) => (
                  <TouchableOpacity
                    key={hrs}
                    onPress={() => setDailyHours(hrs)}
                    className={`flex-1 py-1.5 rounded items-center border ${
                      dailyHours === hrs
                        ? 'bg-quad border-quad'
                        : 'bg-secondary/15 border-border'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[10px] font-bold ${
                        dailyHours === hrs ? 'text-paper' : 'text-graphite'
                      }`}
                    >
                      {hrs}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Chronotype Focus Selector */}
            <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2 shadow-xs">
              <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
                STUDY FOCUS CHRONOTYPE
              </Text>
              <View className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'morning', label: 'Morning Focus' },
                  { id: 'evening', label: 'Evening Focus' },
                  { id: 'balanced', label: 'Balanced Spread' },
                  { id: 'weekend', label: 'Weekend Heavy' },
                ].map((pat) => (
                  <TouchableOpacity
                    key={pat.id}
                    onPress={() => setPreferredPattern(pat.id as any)}
                    className={`p-2 rounded border ${
                      preferredPattern === pat.id
                        ? 'border-chalk bg-chalk/10'
                        : 'border-border bg-paper'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[10px] ${
                        preferredPattern === pat.id ? 'text-chalk font-bold' : 'text-graphite'
                      }`}
                    >
                      {pat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Generate CTA */}
            <TouchableOpacity
              onPress={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded bg-quad items-center justify-center flex-row gap-1.5 shadow-xs"
            >
              <Sparkles size={14} color="#f3f4ef" />
              <Text className="font-mono text-xs font-bold text-paper uppercase">
                {isGenerating ? 'Synthesizing Roadmap...' : 'Generate Adaptive Plan (60 cr) ↗'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── TAB 3: WEEKLY DISTRIBUTION ────────────────────────────── */}
        {activeTab === 'week' && (
          <View className="space-y-2 pb-8">
            <Text className="font-mono text-[10px] font-bold text-graphite uppercase px-1">
              WEEKLY MACRO SCHEDULE (MON - SUN)
            </Text>
            {mockWeeklySchedule.map((day) => (
              <View key={day.day} className="p-3 rounded bg-paper border border-border/80 space-y-1.5">
                <View className="flex-row justify-between items-center">
                  <Text className="font-sans text-xs font-bold text-ink">
                    {day.day} ({day.date})
                  </Text>
                  <Text className="font-mono text-xs font-bold text-quad">{day.totalHours} Hours</Text>
                </View>
                <View className="space-y-0.5">
                  {day.sessions.map((s) => (
                    <Text key={s.id} className="font-sans text-[11px] text-graphite">
                      • {s.subjectCode}: {s.topic} ({s.durationMinutes}m)
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── TAB 4: SPACED REPETITION REVISION ─────────────────────── */}
        {activeTab === 'revision' && (
          <View className="space-y-2 pb-8">
            <Text className="font-mono text-[10px] font-bold text-graphite uppercase px-1">
              SPACED REPETITION CURVES (T-7d, T-3d, T-1d)
            </Text>
            {mockRevisionMilestones.map((rev) => (
              <View key={rev.subjectCode} className="p-3 rounded bg-paper border border-border/80 space-y-1.5">
                <View className="flex-row justify-between items-center">
                  <Text className="font-sans text-xs font-bold text-ink">
                    {rev.subjectCode}: {rev.subject}
                  </Text>
                  <Text className="font-mono text-[9px] font-bold text-quad bg-quad/10 px-1.5 py-0.2 rounded">
                    {rev.coveragePercentage}% Ready
                  </Text>
                </View>

                <View className="p-2 bg-secondary/15 rounded space-y-1 font-mono text-[10px]">
                  <Text className="text-graphite">T-7d: {rev.tMinus7Date}</Text>
                  <Text className="text-graphite">T-3d: {rev.tMinus3Date}</Text>
                  <Text className="text-quad font-bold">T-1d: {rev.tMinus1Date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── TAB 5: MOCK TEST RECOMMENDATIONS ──────────────────────── */}
        {activeTab === 'mocks' && (
          <View className="space-y-2 pb-8">
            <Text className="font-mono text-[10px] font-bold text-graphite uppercase px-1">
              DIAGNOSTIC MOCK TEST RECOMMENDATIONS
            </Text>
            {mockMockTestSuggestions.map((mock) => (
              <View key={mock.id} className="p-3.5 rounded bg-paper border border-marker/40 space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-sans text-xs font-bold text-ink">
                    ⚡ {mock.subjectCode}: {mock.topic}
                  </Text>
                  <Text className="font-mono text-[9px] font-bold text-ink bg-marker/20 px-1.5 py-0.2 rounded">
                    Target: {mock.targetScore}%
                  </Text>
                </View>

                <Text className="font-sans text-[11px] text-graphite">
                  {mock.reason}
                </Text>

                <View className="flex-row justify-between items-center pt-1 border-t border-border/40">
                  <Text className="font-mono text-[10px] text-graphite">
                    {mock.suggestedDate}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/ai/quiz-setup')}
                    className="px-2.5 py-1 rounded bg-quad"
                  >
                    <Text className="font-mono text-[10px] font-bold text-paper">
                      Start Mock ↗
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── TAB 6: SUBJECT READINESS & COUNTDOWNS ─────────────────── */}
        {activeTab === 'analytics' && (
          <View className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs mb-8">
            <View className="flex-row justify-between items-center pb-2 border-b border-border/60">
              <Text className="font-mono text-xs font-bold text-graphite uppercase">
                EXAM READINESS & COVERAGE
              </Text>
              <Text className="font-mono text-xs font-bold text-quad">{readinessScore}% Index</Text>
            </View>

            <View className="space-y-3">
              {mockSubjectReadiness.map((sub) => (
                <View key={sub.id} className="space-y-1">
                  <View className="flex-row justify-between items-center text-xs">
                    <Text className="font-sans font-bold text-ink">
                      {sub.code}: {sub.subject}
                    </Text>
                    <Text className="font-mono text-[10px] font-bold text-marker">
                      {sub.daysLeft}d left
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="flex-1 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                      <View style={{ width: `${sub.coveragePercentage}%` }} className="h-full bg-quad" />
                    </View>
                    <Text className="font-mono text-[10px] text-graphite font-bold">{sub.coveragePercentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* ── Subject Edit / Add Native Modal ─────────────────────────── */}
      <Modal visible={isEditModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <View className="w-full max-w-sm bg-paper rounded-lg border border-border p-4 space-y-3 shadow-xl">
            <View className="flex-row justify-between items-center pb-1.5 border-b border-border/60">
              <Text className="font-sans text-sm font-bold text-ink">
                {subjects.some((s) => s.id === editingSubject?.id) ? 'Modify Course Details' : 'Add New Semester Course'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsEditModalOpen(false);
                  setEditingSubject(null);
                }}
              >
                <X size={16} color="#12151c" />
              </TouchableOpacity>
            </View>

            {editingSubject && (
              <View className="space-y-2.5">
                <View>
                  <Text className="font-mono text-[9px] font-bold text-graphite uppercase mb-1">Course Code</Text>
                  <TextInput
                    value={editingSubject.code}
                    onChangeText={(val) => setEditingSubject({ ...editingSubject, code: val.toUpperCase() })}
                    placeholder="CS-301"
                    className="p-2 border border-border rounded bg-secondary/15 text-xs font-mono text-ink"
                  />
                </View>

                <View>
                  <Text className="font-mono text-[9px] font-bold text-graphite uppercase mb-1">Course Title</Text>
                  <TextInput
                    value={editingSubject.name}
                    onChangeText={(val) => setEditingSubject({ ...editingSubject, name: val })}
                    placeholder="Database Management Systems"
                    className="p-2 border border-border rounded bg-secondary/15 text-xs font-sans text-ink"
                  />
                </View>

                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="font-mono text-[9px] font-bold text-graphite uppercase mb-1">Exam Date (YYYY-MM-DD)</Text>
                    <TextInput
                      value={editingSubject.examDate}
                      onChangeText={(val) => setEditingSubject({ ...editingSubject, examDate: val })}
                      placeholder="2026-10-14"
                      className="p-2 border border-border rounded bg-secondary/15 text-xs font-mono text-ink"
                    />
                  </View>
                  <View className="w-24">
                    <Text className="font-mono text-[9px] font-bold text-graphite uppercase mb-1">Weight (%)</Text>
                    <TextInput
                      keyboardType="numeric"
                      value={editingSubject.weight.toString()}
                      onChangeText={(val) => setEditingSubject({ ...editingSubject, weight: parseInt(val) || 0 })}
                      className="p-2 border border-border rounded bg-secondary/15 text-xs font-mono text-ink"
                    />
                  </View>
                </View>

                <View className="flex-row justify-end gap-2 pt-2 border-t border-border/40">
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditModalOpen(false);
                      setEditingSubject(null);
                    }}
                    className="px-3 py-1.5 rounded"
                  >
                    <Text className="font-mono text-xs text-graphite">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveSubject}
                    className="px-4 py-1.5 rounded bg-quad"
                  >
                    <Text className="font-mono text-xs font-bold text-paper">Save Course</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
