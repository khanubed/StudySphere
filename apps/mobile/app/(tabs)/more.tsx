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
    { title: 'Career & Placements', icon: Briefcase, color: '#4f46e5' },
    { title: 'Alumni Network', icon: Users, color: '#06b6d4' },
    { title: 'Join Live Quiz', icon: Radio, color: '#ef4444' },
    { title: 'Notifications', icon: Bell, color: '#f59e0b' },
    { title: 'Billing & Token Usage', icon: Wallet, color: '#10b981' },
    { title: 'Account Settings', icon: User, color: '#6b7280' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-black text-gray-900">More Options</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4 space-y-4">
        {/* User Card */}
        <View className="p-5 rounded-2xl bg-white border border-gray-100 flex-row items-center gap-4 shadow-sm">
          <View className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 items-center justify-center">
            <Text className="text-xl font-black text-indigo-600">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900">{user?.name || 'Student'}</Text>
            <Text className="text-xs text-gray-500">{user?.email || 'student@campus.edu'}</Text>
            <Text className="text-[10px] font-semibold text-indigo-600 uppercase mt-1">
              Role: {user?.role || 'student'}
            </Text>
          </View>
        </View>

        {/* Navigation list */}
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.title}
                className={`p-4 flex-row items-center justify-between ${
                  idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Icon size={20} color={item.color} />
                  <Text className="text-sm font-semibold text-gray-800">{item.title}</Text>
                </View>
                <ChevronRight size={16} color="#d1d5db" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="p-4 rounded-2xl bg-red-50 border border-red-100 flex-row items-center justify-center gap-2 shadow-sm"
        >
          <LogOut size={18} color="#dc2626" />
          <Text className="text-red-600 font-bold text-sm">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
