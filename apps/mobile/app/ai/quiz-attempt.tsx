import React, { useState, useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import {
  setAnswer,
  toggleMarkForReview,
  setCurrentQuestionIndex,
  nextQuestion,
  prevQuestion,
} from '../../src/store/slices/quizSlice';
import { useGetQuizByIdQuery, useSubmitQuizAttemptMutation } from '../../src/store/api/quizApi';
import {
  Clock,
  Flag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Grid,
} from 'lucide-react-native';

export default function QuizAttemptScreen() {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: quizResponse, isLoading } = useGetQuizByIdQuery('quiz-001');
  const [submitQuizAttempt, { isLoading: isSubmitting }] = useSubmitQuizAttemptMutation();

  const {
    currentQuestionIndex,
    answers,
    markedForReview,
  } = useAppSelector((state) => state.quiz);

  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  const quiz = quizResponse?.data;
  const questions = quiz?.questions || [];
  const currentQ = questions[currentQuestionIndex] || questions[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optText: string) => {
    if (!currentQ) return;
    dispatch(setAnswer({ questionId: currentQ.id, answer: optText }));
  };

  const handleTextAnswerChange = (val: string) => {
    if (!currentQ) return;
    dispatch(setAnswer({ questionId: currentQ.id, answer: val }));
  };

  const handleSubmitFinal = async () => {
    try {
      await submitQuizAttempt({
        quizId: quiz?.id || 'quiz-001',
        answers,
        timeSpentSeconds: 900 - timeLeft,
      }).unwrap();
      setIsSubmitModalOpen(false);
      router.replace('/ai/quiz-results');
    } catch {
      setIsSubmitModalOpen(false);
      router.replace('/ai/quiz-results');
    }
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = markedForReview.length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  if (isLoading || !currentQ) {
    return (
      <SafeAreaView className="flex-1 bg-paper items-center justify-center">
        <Text className="font-mono text-xs text-graphite">Initializing exam hall session...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-paper">
      
      {/* ── Top Exam Bar ───────────────────────────────────────────── */}
      <View className="px-4 py-2.5 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <View>
          <Text className="font-mono text-[9px] uppercase font-bold text-quad">
            EXAM HALL ACTIVE
          </Text>
          <Text className="font-sans text-xs font-bold text-ink">
            Q {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Timer */}
          <View
            className={`flex-row items-center gap-1 px-2 py-1 rounded border ${
              timeLeft < 120
                ? 'border-destructive bg-destructive/10'
                : timeLeft < 300
                ? 'border-marker bg-marker/20'
                : 'border-border bg-secondary/15'
            }`}
          >
            <Clock size={11} color={timeLeft < 120 ? '#d9534f' : '#12151c'} />
            <Text
              className={`font-mono text-xs font-bold ${
                timeLeft < 120 ? 'text-destructive' : 'text-ink'
              }`}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>

          {/* Grid Modal Trigger */}
          <TouchableOpacity
            onPress={() => setIsGridModalOpen(true)}
            className="p-1.5 rounded border border-border bg-paper"
          >
            <Grid size={14} color="#12151c" />
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            onPress={() => setIsSubmitModalOpen(true)}
            className="px-2.5 py-1 bg-quad rounded"
          >
            <Text className="font-mono text-xs font-bold text-paper uppercase">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Question Horizontal Ribbon ─────────────────────────────── */}
      <View className="py-2 px-3 border-b border-border/40 bg-secondary/5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isFlagged = markedForReview.includes(q.id);
            const isCurrent = currentQuestionIndex === idx;

            return (
              <TouchableOpacity
                key={q.id}
                onPress={() => dispatch(setCurrentQuestionIndex(idx))}
                className={`w-7 h-7 rounded items-center justify-center border ${
                  isCurrent
                    ? 'border-chalk bg-chalk/20'
                    : isFlagged
                    ? 'border-marker bg-marker/20'
                    : isAnswered
                    ? 'border-quad bg-quad/10'
                    : 'border-border bg-paper'
                }`}
              >
                <Text
                  className={`font-mono text-[10px] font-bold ${
                    isCurrent
                      ? 'text-chalk'
                      : isFlagged
                      ? 'text-ink'
                      : isAnswered
                      ? 'text-quad'
                      : 'text-graphite'
                  }`}
                >
                  {idx + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Main Question Card ─────────────────────────────────────── */}
      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        <View className="p-4 rounded-md border border-border/80 bg-paper space-y-3 shadow-xs">
          
          {/* Header Tag & Flag */}
          <View className="flex-row justify-between items-center pb-2 border-b border-border/60">
            <View className="flex-row items-center gap-1.5">
              <Text className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-secondary/30 text-ink">
                {currentQ.type.toUpperCase()}
              </Text>
              <Text className="font-mono text-[9px] font-bold text-quad bg-quad/10 px-1.5 py-0.5 rounded">
                {currentQ.marks || 2} MARKS
              </Text>
              <Text className="font-mono text-[9px] text-graphite truncate max-w-[120px]">
                {currentQ.topicTag || 'Core Topic'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => dispatch(toggleMarkForReview(currentQ.id))}
              className="flex-row items-center gap-1"
            >
              <Flag
                size={12}
                color={markedForReview.includes(currentQ.id) ? '#f2c14e' : '#8a8d85'}
              />
              <Text className="font-mono text-[10px] text-graphite">
                {markedForReview.includes(currentQ.id) ? 'Flagged' : 'Flag'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Prompt */}
          <Text className="font-sans text-sm font-bold text-ink leading-relaxed">
            {currentQuestionIndex + 1}. {currentQ.prompt}
          </Text>

          {/* Input Format: MCQ / True-False / Fill Blank / Short Answer */}
          {currentQ.type === 'mcq' || currentQ.type === 'true_false' ? (
            <View className="space-y-2 pt-1">
              {currentQ.options?.map((opt: any, idx: number) => {
                const optText = typeof opt === 'string' ? opt : opt.text;
                const isSelected = answers[currentQ.id] === optText;

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSelectOption(optText)}
                    className={`p-3 rounded border flex-row items-center justify-between ${
                      isSelected
                        ? 'border-quad bg-quad/10'
                        : 'border-border bg-paper'
                    }`}
                  >
                    <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                      <Text className="font-mono text-xs font-bold text-graphite">
                        {String.fromCharCode(65 + idx)}.
                      </Text>
                      <Text className="font-sans text-xs text-ink">{optText}</Text>
                    </View>
                    {isSelected && <CheckCircle2 size={14} color="#2f5d50" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : currentQ.type === 'fill_blank' ? (
            <View className="space-y-1.5 pt-1">
              <Text className="font-mono text-[9px] font-bold text-graphite uppercase">
                TYPE MISSING KEYWORD / TERM:
              </Text>
              <TextInput
                value={typeof answers[currentQ.id] === 'string' ? (answers[currentQ.id] as string) : ''}
                onChangeText={handleTextAnswerChange}
                placeholder="e.g. trivial"
                className="w-full p-2.5 font-mono text-xs rounded border border-border bg-secondary/10 text-ink"
              />
            </View>
          ) : (
            <View className="space-y-1.5 pt-1">
              <Text className="font-mono text-[9px] font-bold text-graphite uppercase">
                STRUCTURED RESPONSE (SHORT ANSWER):
              </Text>
              <TextInput
                value={typeof answers[currentQ.id] === 'string' ? (answers[currentQ.id] as string) : ''}
                onChangeText={handleTextAnswerChange}
                multiline
                numberOfLines={3}
                placeholder="Provide concise conceptual answer..."
                className="w-full p-2.5 font-sans text-xs rounded border border-border bg-secondary/10 text-ink"
              />
            </View>
          )}

        </View>

        {/* ── Bottom Controls ───────────────────────────────────────── */}
        <View className="flex-row justify-between items-center pt-2 pb-6">
          <TouchableOpacity
            disabled={currentQuestionIndex === 0}
            onPress={() => dispatch(prevQuestion())}
            className="p-2.5 rounded border border-border bg-paper flex-row items-center gap-1 disabled:opacity-30"
          >
            <ChevronLeft size={14} color="#12151c" />
            <Text className="font-mono text-xs font-semibold text-ink">Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={currentQuestionIndex >= questions.length - 1}
            onPress={() => dispatch(nextQuestion())}
            className="p-2.5 rounded bg-quad flex-row items-center gap-1 disabled:opacity-30"
          >
            <Text className="font-mono text-xs font-bold text-paper">Save & Next</Text>
            <ChevronRight size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Full Question Navigator Modal ──────────────────────────── */}
      <Modal visible={isGridModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <View className="w-full max-w-sm bg-paper rounded-lg border border-border p-4 space-y-3">
            <View className="flex-row justify-between items-center pb-2 border-b border-border/60">
              <Text className="font-sans text-sm font-bold text-ink">Question Grid</Text>
              <TouchableOpacity onPress={() => setIsGridModalOpen(false)}>
                <X size={16} color="#12151c" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap gap-2 justify-center py-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = markedForReview.includes(q.id);
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <TouchableOpacity
                    key={q.id}
                    onPress={() => {
                      dispatch(setCurrentQuestionIndex(idx));
                      setIsGridModalOpen(false);
                    }}
                    className={`w-10 h-10 rounded items-center justify-center border ${
                      isCurrent
                        ? 'border-chalk bg-chalk/20'
                        : isFlagged
                        ? 'border-marker bg-marker/20'
                        : isAnswered
                        ? 'border-quad bg-quad/10'
                        : 'border-border bg-paper'
                    }`}
                  >
                    <Text className="font-mono text-xs font-bold text-ink">{idx + 1}</Text>
                    <Text className="font-mono text-[8px] text-graphite">
                      {isFlagged ? '⚑' : isAnswered ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Submit Confirmation Modal ──────────────────────────────── */}
      <Modal visible={isSubmitModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <View className="w-full max-w-sm bg-paper rounded-lg border border-border p-4 space-y-3">
            <View className="flex-row justify-between items-center pb-2 border-b border-border/60">
              <Text className="font-display text-base font-bold text-ink">Submit Assessment?</Text>
              <TouchableOpacity onPress={() => setIsSubmitModalOpen(false)}>
                <X size={16} color="#12151c" />
              </TouchableOpacity>
            </View>

            <View className="p-3 bg-secondary/15 rounded space-y-1 font-mono text-xs">
              <View className="flex-row justify-between">
                <Text className="text-graphite">Answered:</Text>
                <Text className="font-bold text-quad">{answeredCount} Qs</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-graphite">Flagged:</Text>
                <Text className="font-bold text-marker">{flaggedCount} Qs</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-graphite">Unanswered:</Text>
                <Text className="font-bold text-destructive">{unansweredCount} Qs</Text>
              </View>
            </View>

            <View className="flex-row gap-2 pt-2">
              <TouchableOpacity
                onPress={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2 rounded border border-border items-center"
              >
                <Text className="font-mono text-xs font-semibold text-ink">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitFinal}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded bg-quad items-center"
              >
                <Text className="font-mono text-xs font-bold text-paper">
                  {isSubmitting ? 'Grading...' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
