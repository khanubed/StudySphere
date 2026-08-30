import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetResourcesQuery } from '../../src/store/api/resourceApi';
import { BookOpen, Search, Heart, ShieldCheck, Plus } from 'lucide-react-native';

export default function MobileResources() {
  const { data, isLoading } = useGetResourcesQuery();
  const resources = data?.data?.items || [
    {
      id: 'res-1',
      title: 'Database Normalization Handwritten Notes',
      type: 'notes',
      subjectId: 'CS-301',
      likesCount: 24,
      status: 'published',
    },
    {
      id: 'res-2',
      title: 'Operating Systems End-Sem PYQ Solutions',
      type: 'pyq',
      subjectId: 'CS-402',
      likesCount: 42,
      status: 'published',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-black text-gray-900">Resource Hub</Text>
        <Text className="text-xs text-gray-500 mt-0.5">Peer notes, verified PYQs, and textbooks</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-3">
        {resources.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="p-4 rounded-2xl bg-white border border-gray-100 space-y-2 shadow-sm"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">
                  {item.type}
                </Text>
                <Text className="text-[10px] text-gray-400">• {item.subjectId}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Heart size={12} color="#ef4444" />
                <Text className="text-xs text-gray-500 font-medium">{item.likesCount || 0}</Text>
              </View>
            </View>

            <Text className="text-sm font-bold text-gray-900 leading-snug">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
