import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code, Terminal, ChevronRight } from 'lucide-react-native';
import { ThemeToggle } from '../../src/components/ThemeToggle';

export default function MobileCoding() {
  const tracks = [
    { title: 'Data Structures & Algorithms', problems: 75, slug: 'dsa', badge: 'CORE' },
    { title: 'Full Stack Web Development', problems: 45, slug: 'web-dev', badge: 'SYSTEMS' },
    { title: 'Core CS Fundamentals', problems: 50, slug: 'core-cs', badge: 'THEORY' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-paper">
      {/* ── 1. HEADER & THEME TOGGLE ─────────────────────────────────── */}
      <View className="px-4 py-3 bg-paper border-b border-border/60 flex-row justify-between items-center">
        <View>
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <Text className="font-mono text-[10px] uppercase font-bold text-quad tracking-wider">
              PLACEMENT PRACTICE
            </Text>
            <Text className="text-graphite text-[10px]">•</Text>
            <Text className="font-mono text-[10px] text-graphite uppercase">170 PROBLEMS</Text>
          </View>
          <Text className="font-sans text-xl font-bold text-ink">Coding Hub</Text>
        </View>

        <ThemeToggle />
      </View>

      {/* ── 2. TRACKS STREAM ─────────────────────────────────────────── */}
      <ScrollView className="flex-1 px-4 py-3 space-y-3" showsVerticalScrollIndicator={false}>
        {tracks.map((track) => (
          <TouchableOpacity
            key={track.slug}
            className="p-4 rounded-md bg-paper border border-border/80 flex-row justify-between items-center shadow-xs"
          >
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-10 h-10 rounded-[4px] bg-secondary/30 border border-border/60 items-center justify-center">
                <Terminal size={18} color="#2f5d50" />
              </View>
              <View className="flex-1">
                <Text className="font-mono text-[9px] uppercase font-bold text-quad">
                  {track.badge}
                </Text>
                <Text className="font-sans text-sm font-bold text-ink">{track.title}</Text>
                <Text className="font-mono text-[10px] text-graphite">{track.problems} Curated Problems</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#8a8d85" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
