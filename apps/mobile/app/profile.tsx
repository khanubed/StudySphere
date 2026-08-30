import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Shield, GraduationCap } from 'lucide-react-native';
import { useAppSelector } from '../src/store/hooks';
import { ThemeToggle } from '../src/components/ThemeToggle';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

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
        <Text className="font-sans text-base font-bold text-ink">Academic Profile</Text>
        <ThemeToggle size={13} className="w-7 h-7" />
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-4" showsVerticalScrollIndicator={false}>
        <View className="p-5 rounded-md border border-border/80 bg-paper items-center space-y-2 shadow-xs">
          <View className="w-16 h-16 rounded-full bg-secondary/50 border border-border items-center justify-center">
            <Text className="font-sans text-2xl font-bold text-quad">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </Text>
          </View>
          <Text className="font-sans text-base font-bold text-ink">{user?.name || 'Sneha Patel'}</Text>
          <Text className="font-mono text-xs text-graphite">{user?.email || 'sneha.patel@scet.ac.in'}</Text>
        </View>

        <View className="p-4 rounded-md border border-border/80 bg-paper space-y-2 font-mono text-xs">
          <Text className="font-mono text-[10px] uppercase font-bold text-graphite pb-1 border-b border-border/40">
            ENROLLMENT DETAILS
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-graphite">ROLE:</Text>
            <Text className="font-bold text-ink">{user?.role?.toUpperCase() || 'STUDENT'}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-graphite">BRANCH:</Text>
            <Text className="text-ink">Computer Science & Engineering</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-graphite">SEMESTER:</Text>
            <Text className="text-ink">Semester 5 (Active)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
