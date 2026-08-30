import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Coins, Check, Sparkles } from 'lucide-react-native';
import { ThemeToggle } from '../src/components/ThemeToggle';

export default function BillingScreen() {
  const router = useRouter();

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
        <Text className="font-sans text-base font-bold text-ink">Token Ledger</Text>
        <ThemeToggle size={13} className="w-7 h-7" />
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-4" showsVerticalScrollIndicator={false}>
        {/* Token Balance */}
        <View className="p-5 rounded-md border border-chalk/40 bg-chalk/10 space-y-2">
          <View className="flex-row justify-between items-center">
            <Text className="font-mono text-[10px] uppercase font-bold text-chalk">
              AI INFERENCE QUOTA
            </Text>
            <Coins size={16} color="#5b7fde" />
          </View>
          <Text className="font-mono text-3xl font-bold text-ink">880</Text>
          <Text className="font-sans text-xs text-graphite">
            880 / 1,000 monthly tokens remaining. Refreshes in 12 days.
          </Text>
        </View>

        {/* Upgrade Plan Card */}
        <View className="p-4 rounded-md border border-quad/40 bg-paper space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="font-sans text-base font-bold text-ink">Pro Scholar Plan</Text>
            <Text className="font-mono text-sm font-bold text-quad">₹199 / mo</Text>
          </View>

          <View className="space-y-1.5">
            {[
              '5,000 Monthly AI Tokens',
              'Unlimited Document Summaries & Mind Maps',
              'High-priority Live Quiz server access',
            ].map((feat, idx) => (
              <View key={idx} className="flex-row items-center gap-2">
                <Check size={13} color="#2f5d50" />
                <Text className="font-sans text-xs text-graphite">{feat}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity className="w-full p-2.5 bg-quad rounded items-center justify-center">
            <Text className="font-mono text-xs font-bold text-paper uppercase">
              Upgrade Subscription ↗
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
