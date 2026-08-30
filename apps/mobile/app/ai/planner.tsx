import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, CheckSquare, Clock, Plus } from 'lucide-react-native';
import { ThemeToggle } from '../../src/components/ThemeToggle';

export default function PlannerScreen() {
  const router = useRouter();

  const tasks = [
    { id: '1', title: 'Revise BCNF Decomposition Proofs', time: '10:00 AM', done: true, subject: 'DBMS' },
    { id: '2', title: 'Complete Operating System Lab 4', time: '02:00 PM', done: false, subject: 'OS' },
    { id: '3', title: 'Solve 3 Dynamic Programming Questions', time: '05:30 PM', done: false, subject: 'DSA' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="px-4 py-3 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 p-1 rounded border border-border"
        >
          <ChevronLeft size={16} color="#12151c" />
          <Text className="font-mono text-xs font-semibold text-ink">Back</Text>
        </TouchableOpacity>
        <Text className="font-sans text-base font-bold text-ink">Study Planner</Text>
        <ThemeToggle size={13} className="w-7 h-7" />
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-4" showsVerticalScrollIndicator={false}>
        <View className="p-4 rounded-md border border-border/80 bg-paper space-y-2.5 shadow-xs">
          <View className="flex-row justify-between items-center pb-2 border-b border-border/60">
            <Text className="font-mono text-xs font-bold text-graphite uppercase">
              TODAY'S REVISION SCHEDULE
            </Text>
            <Text className="font-mono text-xs text-quad font-bold">1 / 3 Completed</Text>
          </View>

          {tasks.map((t) => (
            <View
              key={t.id}
              className={`p-3 rounded-md border flex-row items-center justify-between ${
                t.done ? 'bg-secondary/20 border-border/40 opacity-70' : 'bg-paper border-border/80'
              }`}
            >
              <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                <View
                  className={`w-5 h-5 rounded-[2px] border items-center justify-center ${
                    t.done ? 'border-quad bg-quad' : 'border-border'
                  }`}
                >
                  {t.done && <Text className="text-paper text-xs font-bold">✓</Text>}
                </View>
                <View className="flex-1">
                  <Text className={`font-sans text-xs font-medium ${t.done ? 'line-through text-graphite' : 'text-ink'}`}>
                    {t.title}
                  </Text>
                  <Text className="font-mono text-[10px] text-graphite">
                    {t.subject} • {t.time}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
