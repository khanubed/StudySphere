import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGetQuizResultQuery } from '../../src/store/api/quizApi';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Home,
  ChevronLeft,
} from 'lucide-react-native';

export default function QuizResultsScreen() {

  const router = useRouter();
  const { data: resultResponse, isLoading } = useGetQuizResultQuery('attempt-001');
  const result = resultResponse?.data;

  return (
    <SafeAreaView className="flex-1 bg-paper">
      
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View className="px-4 py-3 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/ai')}
          className="flex-row items-center gap-1 p-1 rounded border border-border"
        >
          <ChevronLeft size={16} color="#12151c" />
          <Text className="font-mono text-xs font-semibold text-ink">AI Suite</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="font-sans text-sm font-bold text-ink">Assessment Diagnostics</Text>
          <Text className="font-mono text-[9px] text-graphite uppercase">Grading Complete</Text>
        </View>

        <View className="w-7 h-7" />
      </View>


      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        
        {/* ── Scorecard Hero Banner ─────────────────────────────────── */}
        <View className="p-4 rounded-md border border-quad/40 bg-quad/10 items-center space-y-1.5 shadow-xs">
          <Award size={32} color="#2f5d50" />
          <Text className="font-mono text-3xl font-bold text-ink">
            {result?.score || 92}%
          </Text>
          <Text className="font-sans text-xs font-semibold text-quad">
            Top {100 - (result?.percentile || 96)}% Cohort Standing • Honors Roll
          </Text>
          <Text className="font-mono text-[10px] text-graphite">
            {result?.correctCount || 9} / {result?.totalQuestions || 10} Correct •{' '}
            {Math.floor((result?.timeTakenSeconds || 684) / 60)}m {(result?.timeTakenSeconds || 684) % 60}s Elapsed
          </Text>
        </View>

        {/* ── Key Metrics Grid (2x2) ─────────────────────────────────── */}
        <View className="flex-row gap-2">
          <View className="flex-1 p-2.5 rounded border border-border/80 bg-paper">
            <Text className="font-mono text-[9px] uppercase font-bold text-graphite">ACCURACY</Text>
            <Text className="font-mono text-sm font-bold text-quad">{result?.accuracy || 90}%</Text>
          </View>
          <View className="flex-1 p-2.5 rounded border border-border/80 bg-paper">
            <Text className="font-mono text-[9px] uppercase font-bold text-graphite">COHORT RANK</Text>
            <Text className="font-mono text-sm font-bold text-chalk">Rank #{result?.rank || 3}</Text>
          </View>
        </View>

        {/* ── Weak Area Syllabus Diagnostics ────────────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2 shadow-xs">
          <View className="flex-row justify-between items-center pb-1.5 border-b border-border/60">
            <Text className="font-mono text-[10px] uppercase font-bold text-graphite">
              SYLLABUS MASTERY BREAKDOWN
            </Text>
            <Text className="font-mono text-[9px] text-quad font-bold">
              {result?.weakTopics?.length || 3} TOPICS
            </Text>
          </View>

          {result?.weakTopics?.map((wt, idx) => (
            <View
              key={idx}
              className="p-2.5 rounded bg-secondary/15 border border-border/60 space-y-1.5"
            >
              <View className="flex-row justify-between items-center">
                <Text className="font-sans text-xs font-bold text-ink flex-1 pr-2">
                  {wt.topic}
                </Text>
                <Text
                  className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    wt.masteryStatus === 'mastered'
                      ? 'bg-quad/10 text-quad'
                      : wt.masteryStatus === 'proficient'
                      ? 'bg-chalk/10 text-chalk'
                      : 'bg-marker/20 text-ink'
                  }`}
                >
                  {wt.masteryStatus === 'mastered'
                    ? 'Mastered'
                    : wt.masteryStatus === 'proficient'
                    ? 'Proficient'
                    : 'Needs Revision'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="font-mono text-[10px] text-graphite">
                  {wt.correctCount} / {wt.totalQuestions} Qs ({wt.accuracyPercentage}%)
                </Text>

                {wt.masteryStatus === 'needs_revision' && (
                  <TouchableOpacity
                    onPress={() => router.push('/ai/summarizer')}
                    className="flex-row items-center gap-1 bg-quad/10 px-2 py-0.5 rounded border border-quad/30"
                  >
                    <Sparkles size={10} color="#2f5d50" />
                    <Text className="font-mono text-[9px] font-bold text-quad">
                      Flashcard Kit ↗
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* ── Question Review Ledger ─────────────────────────────────── */}
        <View className="space-y-2 pt-1">
          <Text className="font-mono text-[10px] uppercase font-bold text-graphite">
            QUESTION REVIEW & EXPLANATIONS ({result?.answers?.length || 0})
          </Text>

          {result?.answers?.map((ans, idx) => (
            <View
              key={ans.questionId}
              className={`p-3 rounded-md border bg-paper space-y-2 ${
                ans.isCorrect ? 'border-border/80' : 'border-destructive/30 bg-destructive/5'
              }`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    ans.isCorrect ? 'bg-quad/10 text-quad' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {ans.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </Text>
                <Text className="font-mono text-[9px] text-graphite">Question {idx + 1}</Text>
              </View>

              <Text className="font-sans text-xs font-bold text-ink">{ans.prompt}</Text>

              <View className="p-2 bg-secondary/15 rounded space-y-0.5 font-mono text-[10px]">
                <Text className="text-graphite font-bold">YOUR CHOICE: {String(ans.selectedAnswer)}</Text>
                <Text className="text-quad font-bold">CORRECT KEY: {String(ans.correctAnswer)}</Text>
              </View>

              {ans.explanation && (
                <Text className="font-sans text-[11px] text-graphite italic leading-relaxed">
                  Note: {ans.explanation}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* ── Bottom Actions ─────────────────────────────────────────── */}
        <View className="flex-row gap-2 pt-2 pb-8">
          <TouchableOpacity
            onPress={() => router.push('/ai/quiz-setup')}
            className="flex-1 p-3 rounded border border-border bg-paper items-center justify-center flex-row gap-1.5"
          >
            <RotateCcw size={14} color="#12151c" />
            <Text className="font-mono text-xs font-semibold text-ink uppercase">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/dashboard')}
            className="flex-1 p-3 rounded bg-quad items-center justify-center flex-row gap-1.5"
          >
            <Home size={14} color="#ffffff" />
            <Text className="font-mono text-xs font-bold text-paper uppercase">Dashboard</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
