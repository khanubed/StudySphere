import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, HelpCircle, FileText, Target, Calendar } from 'lucide-react-native';

export default function MobileAITools() {
  const tools = [
    {
      title: 'Notes Summarizer',
      desc: 'PDF/DOCX to flashcards, smart summaries and key concepts.',
      icon: Sparkles,
      color: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      title: 'AI Quiz Generator',
      desc: 'Generate tailored practice questions from your lecture topics.',
      icon: HelpCircle,
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      title: 'Assignment Helper',
      desc: 'Grammar review, academic citation suggestions, and tone check.',
      icon: FileText,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      title: 'Resume & ATS Analyzer',
      desc: 'Target tech job roles and match high-impact keywords.',
      icon: Target,
      color: '#ec4899',
      bg: '#fdf2f8',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-black text-gray-900">AI Learning Suite</Text>
        <Text className="text-xs text-gray-500 mt-0.5">High-capability academic AI tools</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <TouchableOpacity
              key={tool.title}
              className="p-5 rounded-2xl bg-white border border-gray-100 flex-row items-center gap-4 shadow-sm"
            >
              <View
                style={{ backgroundColor: tool.bg }}
                className="w-12 h-12 rounded-xl items-center justify-center shrink-0"
              >
                <Icon size={22} color={tool.color} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-gray-900">{tool.title}</Text>
                <Text className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tool.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
