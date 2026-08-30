import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'quad' | 'chalk' | 'marker' | 'destructive' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'quad', className = '' }: BadgeProps) {
  const variantStyles = {
    quad: 'bg-quad/10 border-quad/30 text-quad',
    chalk: 'bg-chalk/10 border-chalk/30 text-chalk',
    marker: 'bg-marker/20 border-marker/40 text-ink',
    destructive: 'bg-destructive/10 border-destructive/30 text-destructive',
    secondary: 'bg-secondary/30 border-border text-ink',
  }[variant];

  return (
    <View className={`px-2 py-0.5 rounded-[2px] border ${variantStyles} ${className}`}>
      <Text className="font-mono text-[9px] uppercase font-bold text-inherit">
        {children}
      </Text>
    </View>
  );
}

export default Badge;
