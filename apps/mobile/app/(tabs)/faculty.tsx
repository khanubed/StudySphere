import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Megaphone, HelpCircle, BookOpen, BarChart2, Radio } from 'lucide-react-native';

export default function MobileFaculty() {
  const actions = [
    { title: 'Class Announcements', desc: 'Broadcast updates to students', icon: Megaphone, color: '#4f46e5' },
    { title: 'AI Quiz Creation', desc: 'Generate class assessments', icon: HelpCircle, color: '#10b981' },
    { title: 'Live Classroom Quiz', desc: 'Host real-time game room', icon: Radio, color: '#ef4444' },
    { title: 'Class Analytics', desc: 'Attendance & score breakdown', icon: BarChart2, color: '#f59e0b' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-black text-gray-900">Faculty Portal</Text>
        <Text className="text-xs text-gray-500 mt-0.5">Instructor tools and evaluations</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <TouchableOpacity
              key={act.title}
              className="p-5 rounded-2xl bg-white border border-gray-100 flex-row items-center gap-4 shadow-sm"
            >
              <View className="w-12 h-12 rounded-xl bg-gray-50 items-center justify-center">
                <Icon size={22} color={act.color} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-gray-900">{act.title}</Text>
                <Text className="text-xs text-gray-500">{act.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
