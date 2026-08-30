import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code, Terminal, ChevronRight } from 'lucide-react-native';

export default function MobileCoding() {
  const tracks = [
    { title: 'Data Structures & Algorithms', problems: 75, slug: 'dsa' },
    { title: 'Full Stack Web Development', problems: 45, slug: 'web-dev' },
    { title: 'Core CS Fundamentals', problems: 50, slug: 'core-cs' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-black text-gray-900">Coding Hub</Text>
        <Text className="text-xs text-gray-500 mt-0.5">Placement sheets and AI code reviews</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-3">
        {tracks.map((track) => (
          <TouchableOpacity
            key={track.slug}
            className="p-5 rounded-2xl bg-white border border-gray-100 flex-row justify-between items-center shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
                <Terminal size={20} color="#4f46e5" />
              </View>
              <View>
                <Text className="text-sm font-bold text-gray-900">{track.title}</Text>
                <Text className="text-xs text-gray-500">{track.problems} Curated Problems</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
