import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../src/store/hooks';
import { startQuizAttempt } from '../../src/store/slices/quizSlice';
import { useGenerateAIQuizMutation } from '../../src/store/api/quizApi';
import {
  ChevronLeft,
  Sparkles,
  BookOpen,
  UploadCloud,
  FileText,
  Clock,
  Coins,
  History,
  Check,
  CheckCircle2,
} from 'lucide-react-native';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { QuizDifficulty, QuizQuestionType } from '@studysphere/shared-types';

export default function AIQuizSetupScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // State
  const [sourceType, setSourceType] = useState<'topic_text' | 'upload' | 'resource'>('topic_text');
  const [topicText, setTopicText] = useState('Operating Systems: Virtual Memory & Page Replacement Algorithms');
  const [fileName] = useState('DBMS_Unit3_Normalization_Decomposition.pdf');
  const [resourceTitle] = useState('Computer Networks — TCP/IP Protocol Suite');
  const [questionTypes, setQuestionTypes] = useState<QuizQuestionType[]>(['mcq', 'true_false', 'fill_blank']);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15);
  const [isTimed, setIsTimed] = useState<boolean>(true);

  const [generateAIQuiz, { isLoading }] = useGenerateAIQuizMutation();

  const tokenCost = Math.round(questionCount * 14);

  const toggleQuestionType = (t: QuizQuestionType) => {
    if (questionTypes.includes(t)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter((type) => type !== t));
      }
    } else {
      setQuestionTypes([...questionTypes, t]);
    }
  };

  const handleSelectAllTypes = () => {
    setQuestionTypes(['mcq', 'fill_blank', 'short_answer', 'true_false', 'conceptual']);
  };

  const handleLaunch = async () => {
    const sourceRef =
      sourceType === 'topic_text'
        ? topicText
        : sourceType === 'upload'
        ? fileName
        : resourceTitle;

    try {
      const res = await generateAIQuiz({
        source: sourceType,
        sourceRef,
        fileName: sourceType === 'upload' ? fileName : undefined,
        questionTypes,
        difficulty,
        questionCount,
        timeLimitMinutes: isTimed ? timeLimitMinutes : undefined,
      }).unwrap();

      if (res.data) {
        dispatch(
          startQuizAttempt({
            quizId: res.data.id,
            durationSeconds: isTimed ? timeLimitMinutes * 60 : 0,
          })
        );
        router.push('/ai/quiz-attempt');
      }
    } catch {
      dispatch(
        startQuizAttempt({
          quizId: 'quiz-001',
          durationSeconds: 15 * 60,
        })
      );
      router.push('/ai/quiz-attempt');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-paper">
      {/* ── Top Header ─────────────────────────────────────────────── */}
      <View className="px-4 py-3 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 p-1 rounded border border-border"
        >
          <ChevronLeft size={16} color="#12151c" />
          <Text className="font-mono text-xs font-semibold text-ink">Back</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="font-sans text-sm font-bold text-ink">AI Quiz Simulator</Text>
          <Text className="font-mono text-[9px] text-graphite uppercase">Assessment Desk</Text>
        </View>

        <ThemeToggle size={13} className="w-7 h-7" />
      </View>

      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        
        {/* ── Signature AI Step Chain ───────────────────────────────── */}
        <View className="p-2.5 rounded border border-border/60 bg-secondary/10 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-chalk" />
            <Text className="font-mono text-[10px] font-bold text-chalk">
              01 SOURCE → 02 EXTRACT → 03 EXAM READY
            </Text>
          </View>
          <View className="flex-row items-center gap-1 bg-chalk/10 px-2 py-0.5 rounded border border-chalk/30">
            <Coins size={10} color="#5b7fde" />
            <Text className="font-mono text-[9px] font-bold text-chalk">880 Tokens</Text>
          </View>
        </View>

        {/* ── Section 1: Academic Source Selection ─────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2.5 shadow-xs">
          <View className="flex-row justify-between items-center pb-1.5 border-b border-border/60">
            <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
              01 — SELECT ACADEMIC SOURCE
            </Text>
            <Text className="font-mono text-[9px] text-chalk font-semibold">1 OF 3</Text>
          </View>

          <View className="flex-row gap-2">
            {[
              { id: 'topic_text', label: 'Topic Text', icon: BookOpen },
              { id: 'upload', label: 'Upload PDF', icon: UploadCloud },
              { id: 'resource', label: 'Resource Hub', icon: FileText },
            ].map((src) => {
              const Icon = src.icon;
              const isSelected = sourceType === src.id;

              return (
                <TouchableOpacity
                  key={src.id}
                  onPress={() => setSourceType(src.id as any)}
                  className={`flex-1 p-2.5 rounded border items-center gap-1 ${
                    isSelected
                      ? 'border-chalk bg-chalk/10'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Icon size={14} color={isSelected ? '#5b7fde' : '#8a8d85'} />
                  <Text
                    className={`font-sans text-[11px] font-bold ${
                      isSelected ? 'text-ink' : 'text-graphite'
                    }`}
                  >
                    {src.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {sourceType === 'topic_text' && (
            <View className="space-y-1 pt-1">
              <Text className="font-mono text-[9px] font-bold text-graphite uppercase">
                ENTER TOPIC / SYLLABUS PASSAGE
              </Text>
              <TextInput
                value={topicText}
                onChangeText={setTopicText}
                multiline
                numberOfLines={2}
                placeholder="e.g. Relational Database Normalization, BCNF Decomposition"
                className="w-full p-2.5 text-xs rounded border border-border bg-secondary/10 text-ink font-sans"
              />
            </View>
          )}

          {sourceType === 'upload' && (
            <View className="p-2.5 bg-secondary/15 rounded border border-dashed border-chalk/60 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1 pr-2">
                <FileText size={16} color="#2f5d50" />
                <View>
                  <Text className="font-sans text-xs font-bold text-ink truncate">{fileName}</Text>
                  <Text className="font-mono text-[9px] text-graphite">24 Pages • Ready</Text>
                </View>
              </View>
              <Text className="font-mono text-[9px] font-bold text-quad bg-quad/10 px-1.5 py-0.5 rounded">
                LOADED
              </Text>
            </View>
          )}

          {sourceType === 'resource' && (
            <View className="p-2.5 bg-secondary/15 rounded border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1 pr-2">
                <BookOpen size={16} color="#5b7fde" />
                <View>
                  <Text className="font-sans text-xs font-bold text-ink truncate">{resourceTitle}</Text>
                  <Text className="font-mono text-[9px] text-graphite">Semester 5 • Verified</Text>
                </View>
              </View>
              <Text className="font-mono text-[9px] font-bold text-chalk bg-chalk/10 px-1.5 py-0.5 rounded">
                LINKED
              </Text>
            </View>
          )}
        </View>

        {/* ── Section 2: Question Types Multi-Select ───────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2.5 shadow-xs">
          <View className="flex-row justify-between items-center pb-1.5 border-b border-border/60">
            <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
              02 — QUESTION TYPES ({questionTypes.length} ACTIVE)
            </Text>
            <TouchableOpacity onPress={handleSelectAllTypes}>
              <Text className="font-mono text-[10px] font-bold text-quad">SELECT ALL</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-1.5">
            {[
              { id: 'mcq', label: 'Multiple Choice (MCQ)' },
              { id: 'true_false', label: 'True / False' },
              { id: 'fill_blank', label: 'Fill in Blanks' },
              { id: 'short_answer', label: 'Short Recall' },
              { id: 'conceptual', label: 'Conceptual Proofs' },
            ].map((fmt) => {
              const isChecked = questionTypes.includes(fmt.id as any);
              return (
                <TouchableOpacity
                  key={fmt.id}
                  onPress={() => toggleQuestionType(fmt.id as any)}
                  className={`px-2.5 py-1.5 rounded border flex-row items-center gap-1.5 ${
                    isChecked
                      ? 'border-quad bg-quad/10 text-quad'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] ${
                      isChecked ? 'text-quad font-bold' : 'text-graphite'
                    }`}
                  >
                    {fmt.label}
                  </Text>
                  {isChecked && <Check size={10} color="#2f5d50" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Section 3: Difficulty & Scope ────────────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2.5 shadow-xs">
          <View className="flex-row justify-between items-center pb-1.5 border-b border-border/60">
            <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
              03 — DIFFICULTY & QUESTION COUNT
            </Text>
          </View>

          {/* Difficulty Tier */}
          <View className="space-y-1">
            <Text className="font-mono text-[9px] font-bold text-graphite uppercase">
              DIFFICULTY TIER
            </Text>
            <View className="flex-row gap-1.5">
              {(['easy', 'medium', 'hard', 'mixed'] as const).map((diff) => (
                <TouchableOpacity
                  key={diff}
                  onPress={() => setDifficulty(diff)}
                  className={`flex-1 py-1.5 rounded items-center border capitalize ${
                    difficulty === diff
                      ? 'border-chalk bg-chalk/10'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] capitalize ${
                      difficulty === diff ? 'text-chalk font-bold' : 'text-graphite'
                    }`}
                  >
                    {diff}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Question Count Stepper */}
          <View className="space-y-1 pt-1">
            <Text className="font-mono text-[9px] font-bold text-graphite uppercase">
              QUESTION COUNT
            </Text>
            <View className="flex-row gap-1.5">
              {[5, 10, 15, 20, 30].map((cnt) => (
                <TouchableOpacity
                  key={cnt}
                  onPress={() => setQuestionCount(cnt)}
                  className={`flex-1 py-1.5 rounded items-center border ${
                    questionCount === cnt
                      ? 'border-quad bg-quad'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] font-bold ${
                      questionCount === cnt ? 'text-paper' : 'text-ink'
                    }`}
                  >
                    {cnt} Qs
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Timer Selection */}
          <View className="space-y-1 pt-1 border-t border-border/40">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-1">
                <Clock size={12} color="#8a8d85" />
                <Text className="font-mono text-[10px] font-bold text-ink">Countdown Timer</Text>
              </View>
              <TouchableOpacity onPress={() => setIsTimed(!isTimed)}>
                <Text className={`font-mono text-[9px] font-bold ${isTimed ? 'text-quad' : 'text-graphite'}`}>
                  {isTimed ? 'Enabled' : 'Untimed'}
                </Text>
              </TouchableOpacity>
            </View>

            {isTimed && (
              <View className="flex-row gap-1.5 pt-1">
                {[10, 15, 20, 30].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => setTimeLimitMinutes(mins)}
                    className={`flex-1 py-1 rounded items-center border ${
                      timeLimitMinutes === mins
                        ? 'border-chalk bg-chalk/15'
                        : 'border-border bg-secondary/15'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[9px] font-bold ${
                        timeLimitMinutes === mins ? 'text-chalk' : 'text-graphite'
                      }`}
                    >
                      {mins} Min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ── Section 4: Pre-Flight Audit Ledger ──────────────────── */}
        <View className="p-3 bg-secondary/15 rounded border border-border/80 space-y-1 font-mono text-[10px]">
          <View className="flex-row justify-between">
            <Text className="font-mono text-graphite">Total Assessment Marks:</Text>
            <Text className="font-mono font-bold text-ink">{questionCount * 2} Marks</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-mono text-graphite">Estimated AI Credit Cost:</Text>
            <Text className="font-mono font-bold text-chalk">-{tokenCost} Credits</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-mono text-graphite">Time Allowance:</Text>
            <Text className="font-mono font-bold text-quad">
              {isTimed ? `${timeLimitMinutes} Minutes` : 'Untimed Exam'}
            </Text>
          </View>
        </View>

        {/* ── Primary Generate CTA ─────────────────────────────────── */}
        <TouchableOpacity
          onPress={handleLaunch}
          disabled={isLoading}
          className="w-full p-3.5 bg-quad rounded items-center justify-center flex-row gap-2 shadow-xs mb-8"
        >
          <Sparkles size={14} color="#ffffff" />
          <Text className="font-mono text-xs font-bold text-paper uppercase">
            {isLoading ? 'Synthesizing Assessment Questions...' : `Generate Assessment (${tokenCost} cr) ↗`}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
