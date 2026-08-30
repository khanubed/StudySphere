import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAppSelector } from '../../src/store/hooks';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Code,
  GraduationCap,
  Menu,
} from 'lucide-react-native';

export default function TabsLayout() {
  const { user } = useAppSelector((state) => state.auth);
  const systemColorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const isDark = systemColorScheme === 'dark';
  const isFaculty = user?.role === 'faculty';

  // Dynamic height and padding calculation taking system navigation bar into account
  const bottomInset = insets.bottom;
  const tabHeight = 52 + bottomInset;
  const paddingBottom = bottomInset > 0 ? bottomInset : 8;

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#4CA08A' : '#2F5D50',
        tabBarInactiveTintColor: isDark ? '#A0A29B' : '#8A8D85',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: isDark ? '#373A35' : 'rgba(200, 203, 194, 0.8)',
          backgroundColor: isDark ? '#12151C' : '#F3F4EF',
          height: tabHeight,
          paddingBottom: paddingBottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size || 22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size || 22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Tools',
          tabBarIcon: ({ color, size }) => (
            <Sparkles size={size || 22} color={color} />
          ),
        }}
      />

      {isFaculty ? (
        <Tabs.Screen
          name="faculty"
          options={{
            title: 'Faculty',
            tabBarIcon: ({ color, size }) => (
              <GraduationCap size={size || 22} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="coding"
          options={{
            title: 'Coding',
            tabBarIcon: ({ color, size }) => (
              <Code size={size || 22} color={color} />
            ),
          }}
        />
      )}

      {/* Hide alternative tab when role is different */}
      {isFaculty ? (
        <Tabs.Screen
          name="coding"
          options={{
            href: null,
          }}
        />
      ) : (
        <Tabs.Screen
          name="faculty"
          options={{
            href: null,
          }}
        />
      )}

      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Menu size={size || 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
