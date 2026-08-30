import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetStudentDashboardQuery } from '../../src/store/api/dashboardApi';
import { useAppSelector } from '../../src/store/hooks';
import { Sparkles, BookOpen, Flame } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';

export default function MobileDashboard() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { data } = useGetStudentDashboardQuery();
  const stats = data?.data?.stats;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-4 space-y-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-xs font-semibold text-gray-500 uppercase">Welcome back</Text>
            <Text className="text-2xl font-black text-gray-900">{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/more' as Href)}
            className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 items-center justify-center"
          >
            <Text className="font-bold text-indigo-600 text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Study Streak & AI Token Badge */}
        <View className="p-5 rounded-2xl bg-indigo-600 space-y-3 shadow-md">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
              <Flame size={14} color="#fde047" />
              <Text className="text-white text-xs font-bold">{stats?.studyStreakDays || 5} Day Streak</Text>
            </View>
            <Text className="text-white/80 text-xs">Credits: {stats?.aiTokensRemaining || 880}</Text>
          </View>
          <Text className="text-white text-lg font-bold">StudySphere AI Ecosystem</Text>
          <Text className="text-white/80 text-xs leading-relaxed">
            Generate instant summaries, practice quizzes, and track attendance seamlessly.
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row gap-3">
          <View className="flex-1 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-1">
            <Text className="text-[10px] uppercase font-bold text-gray-400">Attendance</Text>
            <Text className="text-2xl font-black text-indigo-600">{stats?.attendancePercentage || 88}%</Text>
          </View>
          <View className="flex-1 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-1">
            <Text className="text-[10px] uppercase font-bold text-gray-400">Quizzes Taken</Text>
            <Text className="text-2xl font-black text-emerald-600">{stats?.completedQuizzes || 12}</Text>
          </View>
          <View className="flex-1 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-1">
            <Text className="text-[10px] uppercase font-bold text-gray-400">Assignments</Text>
            <Text className="text-2xl font-black text-amber-500">{stats?.upcomingAssignments || 2}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-sm font-bold text-gray-900 mt-2">Instant Tools</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/ai' as Href)}
            className="flex-1 p-4 rounded-2xl bg-white border border-gray-100 items-center justify-center space-y-2 shadow-sm"
          >
            <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
              <Sparkles size={20} color="#4f46e5" />
            </View>
            <Text className="text-xs font-bold text-gray-900">AI Summarizer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/resources' as Href)}
            className="flex-1 p-4 rounded-2xl bg-white border border-gray-100 items-center justify-center space-y-2 shadow-sm"
          >
            <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center">
              <BookOpen size={20} color="#10b981" />
            </View>
            <Text className="text-xs font-bold text-gray-900">Resource Hub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
