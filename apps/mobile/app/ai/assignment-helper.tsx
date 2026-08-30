import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAnalyzeAssignmentMutation } from '../../src/store/api/aiApi';
import {
  mockAssignmentRawText,
  mockGrammarIssues,
  mockCitations,
  mockWritingScore,
  mockStructureOutline,
} from '@studysphere/shared-data';
import {
  ChevronLeft,
  FileEdit,
  Sparkles,
  CheckCircle2,
  Coins,
  History,
  Check,
  X,
  Copy,
  BookOpen,
  GraduationCap,
} from 'lucide-react-native';
import { CitationStyleType, GrammarIssue } from '@studysphere/shared-types';

export default function AIAssignmentHelperScreen() {

  const router = useRouter();

  // State
  const [text, setText] = useState(mockAssignmentRawText);
  const [citationStyle, setCitationStyle] = useState<CitationStyleType>('IEEE');
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'citations' | 'structure'>('overview');
  const [issues, setIssues] = useState<GrammarIssue[]>(mockGrammarIssues);
  const [activeIssue, setActiveIssue] = useState<GrammarIssue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(mockWritingScore);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [analyzeAssignment, { isLoading }] = useAnalyzeAssignmentMutation();

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Number((wordCount / 250).toFixed(1)));

  const handleAnalyze = async () => {
    try {
      await analyzeAssignment({
        text,
        citationStyle,
      }).unwrap();
    } catch {
      // Fallback loaded
    }
  };

  const handleAcceptFix = (issue: GrammarIssue) => {
    const updated = text.replace(issue.originalText, issue.suggestedText);
    setText(updated);
    setIssues(issues.map((iss) => (iss.id === issue.id ? { ...iss, status: 'accepted' } : iss)));
    setScore((prev) => ({
      ...prev,
      overall: Math.min(100, prev.overall + 2),
    }));
    setIsModalOpen(false);
  };

  const handleDismissFix = (issueId: string) => {
    setIssues(issues.map((iss) => (iss.id === issueId ? { ...iss, status: 'rejected' } : iss)));
    setIsModalOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-paper">
      
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View className="px-4 py-3 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 p-1 rounded border border-border"
        >
          <ChevronLeft size={16} color="#12151c" />
          <Text className="font-mono text-xs font-semibold text-ink">Back</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="font-sans text-sm font-bold text-ink">Assignment Studio</Text>
          <Text className="font-mono text-[9px] text-graphite uppercase">Peer Review Desk</Text>
        </View>

        <View className="w-7 h-7" />
      </View>


      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        
        {/* ── Signature AI Step Chain ───────────────────────────────── */}
        <View className="p-2.5 rounded border border-border/60 bg-secondary/10 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-chalk" />
            <Text className="font-mono text-[10px] font-bold text-chalk">
              01 PARSE → 02 GRAMMAR → 03 CITATIONS → 04 READY
            </Text>
          </View>
          <View className="flex-row items-center gap-1 bg-chalk/10 px-2 py-0.5 rounded border border-chalk/30">
            <Coins size={10} color="#5b7fde" />
            <Text className="font-mono text-[9px] font-bold text-chalk">10 cr</Text>
          </View>
        </View>

        {/* ── Manuscript Input Card ─────────────────────────────────── */}
        <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2.5 shadow-xs">
          <View className="flex-row justify-between items-center pb-1.5 border-b border-border/60">
            <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
              MANUSCRIPT DRAFT
            </Text>
            <Text className="font-mono text-[9px] text-graphite font-semibold">
              {wordCount} Words • ~{readingTimeMinutes} min
            </Text>
          </View>

          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            placeholder="Paste academic essay, dissertation chapter, or report text..."
            className="w-full p-2.5 text-xs rounded border border-border bg-secondary/10 text-ink leading-relaxed font-sans"
          />

          {/* Citation Standard Picker */}
          <View className="space-y-1 pt-1">
            <Text className="font-mono text-[9px] font-bold text-graphite uppercase">
              CITATION STYLE
            </Text>
            <View className="flex-row gap-1.5">
              {(['IEEE', 'APA', 'MLA'] as CitationStyleType[]).map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setCitationStyle(st)}
                  className={`flex-1 py-1 rounded items-center border ${
                    citationStyle === st
                      ? 'border-chalk bg-chalk/15'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] font-bold ${
                      citationStyle === st ? 'text-chalk' : 'text-graphite'
                    }`}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAnalyze}
            disabled={isLoading}
            className="w-full p-3 bg-quad rounded items-center justify-center flex-row gap-2 mt-1 shadow-xs"
          >
            <Sparkles size={14} color="#ffffff" />
            <Text className="font-mono text-xs font-bold text-paper uppercase">
              {isLoading ? 'Auditing Manuscript...' : 'Run Academic Audit ↗'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Segmented Result Tabs ─────────────────────────────────── */}
        <View className="flex-row gap-1 p-1 bg-secondary/20 rounded border border-border/60">
          {[
            { id: 'overview', label: 'Scorecard' },
            { id: 'issues', label: `Issues (${issues.filter((i) => i.status === 'pending').length})` },
            { id: 'citations', label: `Citations (${mockCitations.length})` },
            { id: 'structure', label: 'Structure' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded items-center ${
                activeTab === tab.id
                  ? 'bg-paper shadow-xs border border-border/60'
                  : ''
              }`}
            >
              <Text
                className={`font-mono text-[10px] font-bold ${
                  activeTab === tab.id ? 'text-ink' : 'text-graphite'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── TAB 1: OVERVIEW SCORECARD ─────────────────────────────── */}
        {activeTab === 'overview' && (
          <View className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
            <View className="p-3 bg-quad/10 border border-quad/30 rounded flex-row justify-between items-center">
              <View>
                <Text className="font-mono text-[9px] uppercase font-bold text-quad">
                  COMPOSITE SCORE
                </Text>
                <Text className="font-mono text-2xl font-bold text-ink">{score.overall} / 100</Text>
              </View>
              <GraduationCap size={28} color="#2f5d50" />
            </View>

            <View className="space-y-2 font-mono text-[10px]">
              {[
                { label: 'Readability', val: score.readability },
                { label: 'Clarity & Precision', val: score.clarity },
                { label: 'Grammar Accuracy', val: score.grammar },
                { label: 'Academic Tone', val: score.tone },
                { label: 'Section Structure', val: score.structure },
              ].map((item, idx) => (
                <View key={idx} className="space-y-0.5">
                  <View className="flex-row justify-between">
                    <Text className="text-graphite">{item.label}:</Text>
                    <Text className="font-bold text-ink">{item.val}%</Text>
                  </View>
                  <View className="w-full h-1.5 rounded bg-secondary/30 overflow-hidden">
                    <View style={{ width: `${item.val}%` }} className="h-full bg-quad" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── TAB 2: EDITORIAL ISSUES & DIFFS ───────────────────────── */}
        {activeTab === 'issues' && (
          <View className="space-y-2 pb-8">
            {issues.map((iss) => {
              const isResolved = iss.status !== 'pending';

              return (
                <TouchableOpacity
                  key={iss.id}
                  onPress={() => {
                    setActiveIssue(iss);
                    setIsModalOpen(true);
                  }}
                  className={`p-3 rounded border bg-paper space-y-1.5 ${
                    isResolved
                      ? 'border-border/40 opacity-50'
                      : iss.category === 'grammar'
                      ? 'border-destructive/40 bg-destructive/5'
                      : 'border-marker/40 bg-marker/10'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        iss.category === 'grammar' ? 'text-destructive bg-destructive/10' : 'text-ink bg-marker/20'
                      }`}
                    >
                      {iss.category.toUpperCase()} • LINE {iss.line}
                    </Text>
                    <Text className="font-mono text-[9px] text-graphite">Tap to review</Text>
                  </View>

                  <Text className="font-sans text-xs font-bold text-ink">
                    "{iss.originalText}"
                  </Text>
                  <Text className="font-sans text-[11px] text-graphite">
                    {iss.explanation}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── TAB 3: CITATIONS WORKSPACE ────────────────────────────── */}
        {activeTab === 'citations' && (
          <View className="space-y-2 pb-8">
            {mockCitations.map((cit) => (
              <View
                key={cit.id}
                className="p-3 rounded bg-paper border border-border/80 space-y-1.5"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-mono text-[9px] uppercase font-bold text-chalk">
                    {cit.style} STANDARD
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setCopiedId(cit.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="flex-row items-center gap-1"
                  >
                    <Copy size={11} color="#8a8d85" />
                    <Text className="font-mono text-[9px] font-bold text-graphite">
                      {copiedId === cit.id ? 'Copied' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text className="font-mono text-[10px] text-ink leading-relaxed">
                  {cit.formattedText}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── TAB 4: STRUCTURE OUTLINE ──────────────────────────────── */}
        {activeTab === 'structure' && (
          <View className="space-y-2 pb-8">
            {mockStructureOutline.map((sec, idx) => (
              <View
                key={idx}
                className={`p-3 rounded border ${
                  sec.status === 'found' ? 'border-border/60 bg-paper' : 'border-marker/40 bg-marker/10'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-sans text-xs font-bold text-ink">{sec.section}</Text>
                  <Text
                    className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      sec.status === 'found' ? 'bg-quad/10 text-quad' : 'bg-marker/20 text-ink'
                    }`}
                  >
                    {sec.status === 'found' ? 'Found ✓' : 'Missing ⚑'}
                  </Text>
                </View>

                {sec.recommendation && (
                  <Text className="font-sans text-[10px] text-graphite mt-1">
                    {sec.recommendation}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* ── Bottom Sheet Issue Resolution Modal ───────────────────── */}
      {activeIssue && (
        <Modal visible={isModalOpen} transparent animationType="fade">
          <View className="flex-1 bg-black/60 justify-center items-center p-4">
            <View className="w-full max-w-sm bg-paper rounded-lg border border-border p-4 space-y-3 shadow-xl">
              <View className="flex-row justify-between items-center pb-2 border-b border-border/60">
                <Text className="font-display text-sm font-bold text-ink">
                  {activeIssue.category.toUpperCase()} REVISION (LINE {activeIssue.line})
                </Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <X size={16} color="#12151c" />
                </TouchableOpacity>
              </View>

              <Text className="font-sans text-xs text-graphite leading-relaxed">
                {activeIssue.explanation}
              </Text>

              {/* Side by side diff */}
              <View className="p-2.5 bg-secondary/15 rounded border border-border/80 font-mono text-xs space-y-1">
                <Text className="text-destructive font-mono text-[11px] line-through">
                  - {activeIssue.originalText}
                </Text>
                <Text className="text-quad font-mono text-[11px] font-bold">
                  + {activeIssue.suggestedText}
                </Text>
              </View>

              <View className="flex-row gap-2 pt-2">
                <TouchableOpacity
                  onPress={() => handleDismissFix(activeIssue.id)}
                  className="flex-1 py-2 rounded border border-border items-center"
                >
                  <Text className="font-mono text-xs font-semibold text-ink">Dismiss</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAcceptFix(activeIssue)}
                  className="flex-1 py-2 rounded bg-quad items-center"
                >
                  <Text className="font-mono text-xs font-bold text-paper">Accept Fix ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}
