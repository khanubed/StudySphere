import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { clearCredentials } from '../../src/store/slices/authSlice';
import { useRouter, Href } from 'expo-router';
import {
  User,
  Briefcase,
  Users,
  Wallet,
  Bell,
  Radio,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react-native';

export default function MobileMore() {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
    router.replace('/(auth)/login' as Href);
  };

  const menuItems = [
    { title: 'Career & Placements', icon: Briefcase, color: '#2f5d50' },
    { title: 'Alumni Network', icon: Users, color: '#5b7fde' },
    { title: 'Join Live Quiz', icon: Radio, color: '#ef4444' },
    { title: 'Notifications', icon: Bell, color: '#f2c14e' },
    { title: 'Billing & Token Ledger', icon: Wallet, color: '#2f5d50' },
    { title: 'Account & Security Settings', icon: Shield, color: '#8a8d85' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-paper">
      {/* ── 1. HEADER & THEME TOGGLE ─────────────────────────────────── */}
      <View className="px-4 py-3 bg-paper border-b border-border/60 flex-row justify-between items-center">
        <View>
          <Text className="font-mono text-[10px] uppercase font-bold text-quad tracking-wider">
            PREFERENCES & ACCOUNT
          </Text>
          <Text className="font-sans text-xl font-bold text-ink">Account & Settings</Text>
        </View>
      </View>


      <ScrollView className="flex-1 px-4 py-4 space-y-4" showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View className="p-4 rounded-md bg-paper border border-border/80 flex-row items-center gap-3.5 shadow-xs">
          <View className="w-12 h-12 rounded-full bg-secondary/50 border border-border items-center justify-center">
            <Text className="font-sans text-base font-bold text-quad">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-sans text-sm font-bold text-ink">{user?.name || 'Sneha Patel'}</Text>
            <Text className="font-mono text-[11px] text-graphite">{user?.email || 'sneha.patel@scet.ac.in'}</Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Text className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-quad/10 text-quad border border-quad/30">
                ROLE: {user?.role?.toUpperCase() || 'STUDENT'}
              </Text>
              <Text className="font-mono text-[9px] text-graphite">SEM 5 CSE</Text>
            </View>
          </View>
        </View>

        {/* Navigation list */}
        <View className="bg-paper rounded-md border border-border/80 overflow-hidden shadow-xs">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.title}
                className={`p-3.5 flex-row items-center justify-between ${
                  idx !== menuItems.length - 1 ? 'border-b border-border/40' : ''
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Icon size={16} color={item.color} />
                  <Text className="font-sans text-xs font-semibold text-ink">{item.title}</Text>
                </View>
                <ChevronRight size={14} color="#8a8d85" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="p-3 rounded-md bg-destructive/10 border border-destructive/30 flex-row items-center justify-center gap-2"
        >
          <LogOut size={16} color="#ef4444" />
          <Text className="font-mono text-xs font-bold text-destructive uppercase">Sign Out of Ledger</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
