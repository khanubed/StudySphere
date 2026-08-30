import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGetTokenUsageQuery, useGetAISummarizerSessionsQuery } from '../../src/store/api/aiApi';
import {
  Sparkles,
  BookOpen,
  Award,
  FileEdit,
  Calendar,
  Briefcase,
  Code,
  ArrowRight,
  Coins,
  History,
  CheckCircle2,
} from 'lucide-react-native';

export default function MobileAIToolsHub() {

  const router = useRouter();
  const { data: tokenUsageResponse } = useGetTokenUsageQuery();
  const { data: sessionsResponse } = useGetAISummarizerSessionsQuery();

  const tokenUsage = tokenUsageResponse?.data || { used: 120, limit: 1000 };
  const recentSessions = sessionsResponse?.data?.slice(0, 2) || [];

  const tools = [
    {
      id: 'summarizer',
      title: 'AI Notes Summarizer',
      subtitle: 'Transform lecture PDFs into complete study kits',
      description: 'Generates executive summaries, LaTeX formula sheets, 3D interactive flashcards, exam questions & SVG mind maps.',
      icon: BookOpen,
      badge: 'Core Synthesis',
      badgeColor: 'text-quad bg-quad/10 border-quad/30',
      tokenCost: '120 - 540 ops',
      route: '/ai/summarizer',
    },
    {
      id: 'quiz',
      title: 'AI Quiz Generator',
      subtitle: 'Adaptive self-testing from topics or syllabus',
      description: 'Generates MCQ, true/false, and short-answer assessments with instant grading and honor roll analytics.',
      icon: Award,
      badge: 'Test Prep',
      badgeColor: 'text-chalk bg-chalk/10 border-chalk/30',
      tokenCost: '80 - 150 ops',
      route: '/ai/quiz-setup',
    },
    {
      id: 'assignment',
      title: 'AI Assignment & Citation Helper',
      subtitle: 'Academic writing auditor & citation builder',
      description: 'Audits writing tone, grammatical rigor, and formats citations in IEEE, APA 7th, MLA 9th, and Chicago.',
      icon: FileEdit,
      badge: 'Citations',
      badgeColor: 'text-quad bg-quad/10 border-quad/30',
      tokenCost: '50 - 100 ops',
      route: '/ai/assignment-helper',
    },
    {
      id: 'planner',
      title: 'AI Adaptive Study Planner',
      subtitle: 'Targeted revision schedule generator',
      description: 'Generates weekly study milestones, revision blocks, and mock test dates aligned with your semester exams.',
      icon: Calendar,
      badge: 'Scheduling',
      badgeColor: 'text-chalk bg-chalk/10 border-chalk/30',
      tokenCost: '60 ops',
      route: '/ai/planner',
    },
    {
      id: 'resume',
      title: 'AI Placement Resume Analyzer',
      subtitle: 'ATS score & role-specific keyword matcher',
      description: 'Calculates recruiter ATS compatibility score and identifies high-impact keywords for campus placements.',
      icon: Briefcase,
      badge: 'Placement',
      badgeColor: 'text-quad bg-quad/10 border-quad/30',
      tokenCost: '100 ops',
      route: '/ai/resume-analyzer',
    },
    {
      id: 'coding',
      title: 'AI Code Reviewer',
      subtitle: 'Algorithmic complexity & optimization tips',
      description: 'Deep static analysis of DSA code, time/space complexity calculation, and edge-case boundary checks.',
      icon: Code,
      badge: 'Coding Hub',
      badgeColor: 'text-chalk bg-chalk/10 border-chalk/30',
      tokenCost: '80 ops',
      route: '/(tabs)/coding',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-paper">
      
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View className="px-4 pt-3 pb-3 border-b border-border/60 bg-paper">
        <View className="flex-row justify-between items-center mb-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-mono text-[10px] uppercase font-bold text-chalk tracking-wider">
              AI RESEARCH DESK
            </Text>
            <Text className="text-graphite text-[10px]">•</Text>
            <Text className="font-mono text-[10px] text-graphite uppercase">
              {tokenUsage.limit - tokenUsage.used} TOKENS
            </Text>
          </View>
        </View>

        <Text className="font-sans text-2xl font-bold text-ink">Academic AI Hub</Text>

        <Text className="font-sans text-xs text-graphite mt-0.5">
          Select an academic tool to synthesize notes, self-test, plan, or audit.
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-4" showsVerticalScrollIndicator={false}>
        
        {/* ── Token Ledger Summary Banner ────────────────────────────── */}
        <View className="p-4 rounded-md border border-chalk/40 bg-chalk/10 flex-row justify-between items-center shadow-xs">
          <View className="space-y-0.5">
            <Text className="font-mono text-[10px] uppercase font-bold text-chalk">
              MONTHLY AI QUOTA
            </Text>
            <Text className="font-mono text-xl font-bold text-ink">
              {tokenUsage.limit - tokenUsage.used}{' '}
              <Text className="text-xs font-normal text-graphite">/ {tokenUsage.limit} ops</Text>
            </Text>
            <Text className="font-sans text-[10px] text-graphite">
              Quota refreshes automatically every billing cycle.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/billing')}
            className="px-3 py-1.5 bg-chalk rounded items-center"
          >
            <Text className="font-mono text-[11px] font-bold text-paper">Upgrade Plan ↗</Text>
          </TouchableOpacity>
        </View>

        {/* ── Tool Catalog List ──────────────────────────────────────── */}
        <View className="space-y-3 pb-8">
          <Text className="font-mono text-xs font-bold text-graphite uppercase tracking-wider">
            AVAILABLE ACADEMIC TOOLS ({tools.length})
          </Text>

          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <TouchableOpacity
                key={tool.id}
                onPress={() => router.push(tool.route as any)}
                className="p-4 rounded-md border border-border/80 bg-paper space-y-2 shadow-xs active:bg-secondary/20"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                    <View className="p-2 rounded bg-secondary/30 border border-border/60">
                      <Icon size={18} color="#2f5d50" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-sans text-sm font-bold text-ink">
                        {tool.title}
                      </Text>
                      <Text className="font-mono text-[10px] text-graphite">
                        {tool.subtitle}
                      </Text>
                    </View>
                  </View>

                  <View className={`px-2 py-0.5 rounded border ${tool.badgeColor}`}>
                    <Text className="font-mono text-[9px] uppercase font-bold">
                      {tool.badge}
                    </Text>
                  </View>
                </View>

                <Text className="font-sans text-xs text-graphite leading-relaxed">
                  {tool.description}
                </Text>

                <View className="flex-row justify-between items-center pt-2 border-t border-border/40">
                  <Text className="font-mono text-[10px] text-graphite">
                    Cost: <Text className="text-chalk font-bold">{tool.tokenCost}</Text>
                  </Text>

                  <View className="flex-row items-center gap-1">
                    <Text className="font-mono text-xs font-bold text-quad">Open Tool</Text>
                    <ArrowRight size={13} color="#2f5d50" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
