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
import { useGetQuizHistoryQuery } from '../../src/store/api/quizApi';
import {
  ChevronLeft,
  History,
  Award,
  Clock,
  Search,
  ArrowRight,
} from 'lucide-react-native';

export default function QuizHistoryScreen() {

  const router = useRouter();
  const { data: historyResponse, isLoading } = useGetQuizHistoryQuery();
  const [searchQuery, setSearchQuery] = useState('');

  const attempts = historyResponse?.data || [];
  const filtered = attempts.filter((att) =>
    att.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <View className="items-center">
          <Text className="font-sans text-sm font-bold text-ink">Assessment History</Text>
          <Text className="font-mono text-[9px] text-graphite uppercase">Audit Ledger</Text>
        </View>

        <View className="w-7 h-7" />
      </View>


      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        
        {/* Search */}
        <View className="relative">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search past attempts..."
            className="w-full p-2.5 pl-3 rounded border border-border bg-secondary/10 text-xs text-ink"
          />
        </View>

        {/* List of Attempts */}
        <View className="space-y-2.5 pb-8">
          {filtered.map((att) => (
            <TouchableOpacity
              key={att.id}
              onPress={() => router.push('/ai/quiz-results')}
              className="p-3.5 rounded-md border border-border/80 bg-paper space-y-2 shadow-xs"
            >
              <View className="flex-row justify-between items-center">
                <Text className="font-mono text-xs font-bold text-ink">{att.id}</Text>
                <Text className="font-mono text-[9px] text-graphite">
                  {new Date(att.startedAt).toLocaleDateString()}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pt-1 border-t border-border/40">
                <View className="flex-row items-center gap-3 font-mono text-xs">
                  <Text className="font-mono text-xs font-bold text-quad">{att.score}% Grade</Text>
                  <Text className="font-mono text-[10px] text-graphite">{att.accuracy}% Accuracy</Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <Text className="font-mono text-[10px] font-bold text-quad">Review</Text>
                  <ArrowRight size={12} color="#2f5d50" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
