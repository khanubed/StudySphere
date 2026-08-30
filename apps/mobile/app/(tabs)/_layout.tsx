import React from 'react';
import { Tabs } from 'expo-router';
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
  const isFaculty = user?.role === 'faculty';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          backgroundColor: '#ffffff',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
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
