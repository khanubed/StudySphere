import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, BookOpen, Award, CheckCircle2 } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();

  const notifs = [
    {
      id: '1',
      title: 'Resource Approved',
      body: 'Your Unit 3 DBMS Normalization notes were verified and published.',
      time: '2 hours ago',
      type: 'resource',
    },
    {
      id: '2',
      title: 'Honor Roll Ranking',
      body: 'You advanced to Rank #2 in Semester 5 Cohort Leaderboard.',
      time: '1 day ago',
      type: 'award',
    },
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
        <Text className="font-sans text-base font-bold text-ink">Notifications</Text>
        <View className="w-7 h-7" />
      </View>


      <ScrollView className="flex-1 px-4 py-4 space-y-3" showsVerticalScrollIndicator={false}>
        {notifs.map((n) => (
          <View key={n.id} className="p-3.5 rounded-md border border-border/80 bg-paper space-y-1 shadow-xs">
            <View className="flex-row justify-between items-center">
              <Text className="font-mono text-[9px] uppercase font-bold text-quad">
                {n.type.toUpperCase()}
              </Text>
              <Text className="font-mono text-[10px] text-graphite">{n.time}</Text>
            </View>
            <Text className="font-sans text-xs font-bold text-ink">{n.title}</Text>
            <Text className="font-sans text-xs text-graphite leading-relaxed">{n.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
