import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useGetAISummarizerSessionsQuery,
  useGetAISummarizerSessionByIdQuery,
  useSynthesizeStudyKitMutation,
  useGetTokenUsageQuery,
} from '../../src/store/api/aiApi';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import {
  setActiveSessionId,
  setActiveSummaryTab,
  setActiveAssetAccordion,
  setSelectedDepth,
  setFlashcardIndex,
  toggleCardFlip,
  toggleCardMastery,
  setFilterQuestionType,
} from '../../src/store/slices/summarizerSlice';
import {
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  HelpCircle,
  Network,
  History,
  X,
  ArrowRight,
  Coins,
  Copy,
  Check,
} from 'lucide-react-native';
import { SummaryDepth } from '@studysphere/shared-types';

export default function AISummarizerScreen() {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    activeSessionId,
    activeSummaryTab,
    activeAssetAccordion,
    selectedDepth,
    flashcardIndex,
    isCardFlipped,
    masteredCards,
    filterQuestionType,
  } = useAppSelector((state) => state.summarizer);

  const [refreshing, setRefreshing] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // RTK Query hooks
  const { data: sessionsResponse, refetch: refetchSessions } = useGetAISummarizerSessionsQuery();
  const { data: activeSessionResponse, refetch: refetchActiveSession } =
    useGetAISummarizerSessionByIdQuery(activeSessionId || 'sum-ses-001');
  const { data: tokenUsageResponse } = useGetTokenUsageQuery();
  const [synthesizeStudyKit, { isLoading: isSynthesizing }] = useSynthesizeStudyKitMutation();

  const sessions = sessionsResponse?.data || [];
  const session = activeSessionResponse?.data || sessions[0];
  const tokenUsage = tokenUsageResponse?.data || { used: 120, limit: 1000 };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSessions(), refetchActiveSession()]);
    setRefreshing(false);
  };

  const handleCopy = (text: string) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFlashcard = session?.flashcards?.[flashcardIndex] || {
    id: 'fc-default',
    front: 'No flashcard available',
    back: 'No explanation available',
  };

  const filteredQuestions =
    session?.questions?.filter((q) =>
      filterQuestionType === 'all' ? true : q.type === filterQuestionType
    ) || [];

  return (
    <SafeAreaView className="flex-1 bg-paper">
      
      {/* Header */}
      <View className="px-4 py-3 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 p-1 rounded border border-border"
        >
          <ChevronLeft size={16} color="#12151c" />
          <Text className="font-mono text-xs font-semibold text-ink">Back</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-1.5">
          <TouchableOpacity
            onPress={() => setIsHistoryModalOpen(true)}
            className="p-1 rounded-[4px] border border-border bg-secondary/20"
          >
            <History size={13} color="#8a8d85" />
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="space-y-4 pb-12">
          
          {/* Title & Metadata */}
          <View>
            <View className="flex-row items-center gap-1.5 mb-1">
              <Text className="font-mono text-[10px] uppercase font-bold text-chalk tracking-wider">
                STUDY KIT SYNTHESIZER
              </Text>
              <Text className="text-graphite text-[10px]">•</Text>
              <Text className="font-mono text-[10px] text-graphite uppercase">
                {tokenUsage.limit - tokenUsage.used} TOKENS
              </Text>
            </View>
            <Text className="font-sans text-xl font-bold text-ink">
              {session?.title || 'AI Notes Summarizer'}
            </Text>
          </View>

          {/* Step Chain Pipeline Stepper */}
          <View className="p-2.5 rounded-md border border-border/80 bg-paper">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {[
                { step: '01', name: 'DOC', status: 'complete' },
                { step: '02', name: 'SUMMARY', status: 'complete' },
                { step: '03', name: 'NOTES', status: 'complete' },
                { step: '04', name: 'CARDS', status: 'complete' },
                { step: '05', name: 'Q&A', status: 'complete' },
                { step: '06', name: 'MAP', status: 'complete' },
              ].map((st) => (
                <View
                  key={st.name}
                  className="px-2 py-1 rounded-[3px] bg-quad/10 border border-quad/40 flex-row items-center gap-1"
                >
                  <Text className="font-mono text-[10px] text-quad font-bold">✓ {st.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Document Selection Card */}
          <View className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2.5 shadow-xs">
            <View className="flex-row justify-between items-center">
              <Text className="font-mono text-[10px] uppercase font-bold text-graphite">
                ACTIVE ACADEMIC SOURCE
              </Text>
              <Text className="font-mono text-[10px] text-chalk font-bold">24 PAGES</Text>
            </View>

            <View className="p-2.5 rounded bg-secondary/15 border border-border/60 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1 pr-2">
                <FileText size={16} color="#2f5d50" />
                <Text className="font-sans text-xs font-bold text-ink truncate">
                  {session?.fileName || 'DBMS_Unit3_Normalization.pdf'}
                </Text>
              </View>
              <Text className="font-mono text-[9px] font-bold text-quad bg-quad/10 px-1.5 py-0.5 rounded">
                VERIFIED
              </Text>
            </View>

            {/* Extraction Depth Pills */}
            <View className="flex-row gap-1.5 pt-1">
              {(['quick', 'standard', 'detailed'] as const).map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => dispatch(setSelectedDepth(d))}
                  className={`flex-1 py-1.5 rounded items-center border ${
                    selectedDepth === d
                      ? 'border-chalk bg-chalk/10'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] capitalize ${
                      selectedDepth === d ? 'text-chalk font-bold' : 'text-graphite'
                    }`}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Asset Tab Selector */}
          <View className="flex-row bg-secondary/30 p-1 rounded-md border border-border/60">
            {[
              { id: 'notes', label: 'Notes & Formulas' },
              { id: 'flashcards', label: 'Flashcards' },
              { id: 'questions', label: 'Exam Q&A' },
              { id: 'mindmap', label: 'Mind Map' },
            ].map((tab) => {
              const isSelected = activeAssetAccordion === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => dispatch(setActiveAssetAccordion(tab.id as any))}
                  className={`flex-1 py-1.5 items-center rounded-[3px] ${
                    isSelected ? 'bg-quad shadow-xs' : ''
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] ${
                      isSelected ? 'text-paper font-bold' : 'text-graphite font-semibold'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TAB CONTENT 1: SUMMARY & NOTES */}
          {activeAssetAccordion === 'notes' && (
            <View className="space-y-3">
              {/* Executive vs Detailed Switch */}
              <View className="flex-row bg-secondary/20 p-0.5 rounded-[4px] border border-border/60">
                <TouchableOpacity
                  onPress={() => dispatch(setActiveSummaryTab('short'))}
                  className={`flex-1 py-1 items-center rounded-[2px] ${
                    activeSummaryTab === 'short' ? 'bg-quad' : ''
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] ${
                      activeSummaryTab === 'short' ? 'text-paper font-bold' : 'text-graphite'
                    }`}
                  >
                    Executive Summary
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch(setActiveSummaryTab('detailed'))}
                  className={`flex-1 py-1 items-center rounded-[2px] ${
                    activeSummaryTab === 'detailed' ? 'bg-quad' : ''
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] ${
                      activeSummaryTab === 'detailed' ? 'text-paper font-bold' : 'text-graphite'
                    }`}
                  >
                    Comprehensive Notes
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Summary Text */}
              <View className="p-4 rounded-md bg-paper border border-border/80 space-y-2 shadow-xs">
                <Text className="font-sans text-xs text-ink leading-relaxed">
                  {activeSummaryTab === 'short'
                    ? session?.shortSummary
                    : session?.detailedSummary}
                </Text>
              </View>

              {/* Key Concepts Table */}
              <View className="p-4 rounded-md bg-paper border border-border/80 space-y-2.5 shadow-xs">
                <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
                  KEY CONCEPTS ({session?.keyConcepts?.length || 0})
                </Text>

                {session?.keyConcepts?.map((kc: any, idx: number) => (
                  <View
                    key={idx}
                    className="p-2.5 rounded-[4px] bg-secondary/15 border border-border/60 space-y-1"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="font-mono text-xs font-bold text-ink">
                        {kc.term}
                      </Text>
                      <Text className="font-mono text-[9px] uppercase font-bold text-quad bg-quad/10 px-1 py-0.2 rounded-[2px]">
                        {kc.examRelevance || 'HIGH'}
                      </Text>
                    </View>
                    <Text className="font-sans text-[11px] text-graphite leading-snug">
                      {kc.definition}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Formula Sheets */}
              {session?.formulas && session.formulas.length > 0 && (
                <View className="p-4 rounded-md bg-paper border border-border/80 space-y-2.5 shadow-xs">
                  <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
                    FORMULAS & THEOREMS
                  </Text>

                  {session.formulas.map((f) => (
                    <View
                      key={f.id}
                      className="p-2.5 rounded-[4px] bg-secondary/15 border border-border/60 space-y-1"
                    >
                      <Text className="font-mono text-xs font-bold text-ink">{f.title}</Text>
                      <View className="p-2 bg-paper rounded-[3px] border border-border/80">
                        <Text className="font-mono text-xs text-quad font-bold text-center">
                          {f.latex}
                        </Text>
                      </View>
                      <Text className="font-sans text-[10px] text-graphite">{f.explanation}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* TAB CONTENT 2: 3D FLASHCARDS */}
          {activeAssetAccordion === 'flashcards' && (
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
                  CARD {flashcardIndex + 1} OF {session?.flashcards?.length || 1}
                </Text>
                <Text className="font-mono text-[10px] text-quad font-bold">
                  {masteredCards.length} Mastered
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => dispatch(toggleCardFlip())}
                className="p-6 rounded-md border border-border/80 bg-secondary/15 min-h-[220px] justify-between shadow-xs"
              >
                <View className="flex-row justify-between items-center font-mono text-[9px] uppercase">
                  <Text className="font-bold text-chalk text-[9px]">
                    {currentFlashcard.tag || 'TOPIC'}
                  </Text>
                  <Text className="text-graphite text-[9px]">
                    {isCardFlipped ? 'BACK (ANSWER)' : 'FRONT (QUESTION)'}
                  </Text>
                </View>

                <View className="py-4 items-center justify-center">
                  <Text className="font-sans text-sm font-bold text-ink text-center leading-snug">
                    {isCardFlipped ? currentFlashcard.back : currentFlashcard.front}
                  </Text>
                  <Text className="font-mono text-[10px] text-graphite mt-3">
                    (Tap to flip)
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="font-mono text-[10px] text-graphite">StudySphere Deck</Text>
                  <Text className="font-mono text-[10px] text-quad font-bold">
                    {isCardFlipped ? '✓ Verified' : 'Reveal Answer ↗'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View className="flex-row items-center justify-between gap-2 pt-1">
                <View className="flex-row items-center gap-1.5">
                  <TouchableOpacity
                    disabled={flashcardIndex === 0}
                    onPress={() => dispatch(setFlashcardIndex(Math.max(0, flashcardIndex - 1)))}
                    className="p-2 rounded-[3px] border border-border bg-paper disabled:opacity-30"
                  >
                    <ChevronLeft size={16} color="#12151c" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={flashcardIndex >= (session?.flashcards?.length || 1) - 1}
                    onPress={() =>
                      dispatch(
                        setFlashcardIndex(
                          Math.min((session?.flashcards?.length || 1) - 1, flashcardIndex + 1)
                        )
                      )
                    }
                    className="p-2 rounded-[3px] border border-border bg-paper disabled:opacity-30"
                  >
                    <ChevronRight size={16} color="#12151c" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => dispatch(toggleCardMastery(currentFlashcard.id))}
                  className={`px-4 py-2 rounded-[3px] border font-mono ${
                    masteredCards.includes(currentFlashcard.id)
                      ? 'border-quad bg-quad'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Text
                    className={`font-mono text-xs font-bold uppercase ${
                      masteredCards.includes(currentFlashcard.id)
                        ? 'text-paper'
                        : 'text-ink'
                    }`}
                  >
                    {masteredCards.includes(currentFlashcard.id) ? '✓ Mastered' : 'Mark Mastered'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB CONTENT 3: EXAM QUESTIONS */}
          {activeAssetAccordion === 'questions' && (
            <View className="space-y-3">
              <View className="flex-row gap-1">
                {(['all', 'short', 'long', 'viva'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => dispatch(setFilterQuestionType(t))}
                    className={`px-2.5 py-1 rounded-[2px] border ${
                      filterQuestionType === t
                        ? 'border-quad bg-quad'
                        : 'border-border bg-paper'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[10px] capitalize ${
                        filterQuestionType === t ? 'text-paper font-bold' : 'text-graphite'
                      }`}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {filteredQuestions.map((q) => (
                <View
                  key={q.id}
                  className="p-3.5 rounded-md bg-paper border border-border/80 space-y-2 shadow-xs"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="font-mono text-[9px] uppercase font-bold text-quad bg-quad/10 px-1 py-0.5 rounded-[2px]">
                      {q.type.toUpperCase()} ({q.marks} MARKS)
                    </Text>
                  </View>

                  <Text className="font-sans text-xs font-bold text-ink">{q.question}</Text>

                  <View className="p-2.5 bg-secondary/15 rounded-[3px] border border-border/60 space-y-1">
                    <Text className="font-mono text-[9px] font-bold text-graphite uppercase">
                      MODEL ANSWER GUIDE:
                    </Text>
                    <Text className="font-sans text-[11px] text-graphite leading-relaxed">
                      {q.modelAnswer}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB CONTENT 4: MIND MAP */}
          {activeAssetAccordion === 'mindmap' && (
            <View className="space-y-3">
              <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
                VISUAL KNOWLEDGE TREE
              </Text>

              <View className="p-3.5 rounded-md bg-paper border border-border/80 space-y-2.5">
                <View className="p-2 rounded bg-quad items-center">
                  <Text className="font-mono text-xs text-paper font-bold text-center">
                    {session?.mindMap?.label || 'Concept Root'}
                  </Text>
                </View>

                {session?.mindMap?.children?.map((child, idx) => (
                  <View key={idx} className="p-2.5 rounded bg-secondary/15 border border-border space-y-1">
                    <Text className="font-mono text-[11px] font-bold text-ink">{child.label}</Text>
                    {child.children && (
                      <View className="space-y-0.5 pl-2">
                        {child.children.map((sub, sidx) => (
                          <Text key={sidx} className="font-sans text-[10px] text-graphite">
                            • {sub.label}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* History Modal */}
      <Modal
        visible={isHistoryModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsHistoryModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-paper rounded-t-xl p-5 space-y-4 max-h-[80%] border-t border-border">
            <View className="flex-row justify-between items-center border-b border-border/60 pb-3">
              <View>
                <Text className="font-mono text-[10px] uppercase font-bold text-quad">
                  STUDY SESSIONS LEDGER
                </Text>
                <Text className="font-sans text-lg font-bold text-ink">
                  Past Study Kits ({sessions.length})
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsHistoryModalOpen(false)}>
                <X size={20} color="#8a8d85" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="space-y-2">
              {sessions.map((ses) => (
                <TouchableOpacity
                  key={ses.id}
                  onPress={() => {
                    dispatch(setActiveSessionId(ses.id));
                    setIsHistoryModalOpen(false);
                  }}
                  className={`p-3.5 rounded-md border flex-row justify-between items-center ${
                    ses.id === activeSessionId
                      ? 'border-quad bg-quad/10'
                      : 'border-border bg-paper'
                  }`}
                >
                  <View className="flex-1 pr-2">
                    <Text className="font-mono text-[9px] uppercase font-bold text-chalk">
                      {ses.depth.toUpperCase()} • {ses.totalPages} PAGES
                    </Text>
                    <Text className="font-sans text-xs font-bold text-ink mt-0.5">
                      {ses.title}
                    </Text>
                  </View>
                  <ArrowRight size={14} color="#2f5d50" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
