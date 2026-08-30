import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Megaphone, HelpCircle, BookOpen, BarChart2, Radio, ChevronRight } from 'lucide-react-native';
import { ThemeToggle } from '../../src/components/ThemeToggle';

export default function MobileFaculty() {
  const actions = [
    { title: 'Class Announcements', desc: 'Broadcast updates to students', icon: Megaphone, color: '#2f5d50' },
    { title: 'AI Quiz Creation', desc: 'Generate class assessments', icon: HelpCircle, color: '#5b7fde' },
    { title: 'Live Classroom Quiz', desc: 'Host real-time game room', icon: Radio, color: '#ef4444' },
    { title: 'Class Analytics', desc: 'Attendance & score breakdown', icon: BarChart2, color: '#f2c14e' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-paper">
      {/* ── 1. HEADER & THEME TOGGLE ─────────────────────────────────── */}
      <View className="px-4 py-3 bg-paper border-b border-border/60 flex-row justify-between items-center">
        <View>
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <Text className="font-mono text-[10px] uppercase font-bold text-quad tracking-wider">
              FACULTY INSTRUCTOR PORTAL
            </Text>
          </View>
          <Text className="font-sans text-xl font-bold text-ink">Instructor Console</Text>
        </View>

        <ThemeToggle />
      </View>

      {/* ── 2. ACTIONS STREAM ─────────────────────────────────────────── */}
      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <TouchableOpacity
              key={act.title}
              className="p-4 rounded-md bg-paper border border-border/80 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <View className="w-10 h-10 rounded-[4px] bg-secondary/30 border border-border/60 items-center justify-center">
                  <Icon size={18} color={act.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans text-sm font-bold text-ink">{act.title}</Text>
                  <Text className="font-sans text-xs text-graphite">{act.desc}</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#8a8d85" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
