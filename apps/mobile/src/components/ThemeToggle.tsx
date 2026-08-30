import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Sun, Moon } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme } from '../store/slices/uiSlice';

interface ThemeToggleProps {
  size?: number;
  className?: string;
}

export function ThemeToggle({ size = 16, className = '' }: ThemeToggleProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const dispatch = useAppDispatch();
  const reduxTheme = useAppSelector((state) => state.ui.theme);

  const isDark = colorScheme === 'dark' || reduxTheme === 'dark';

  const handleToggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setColorScheme(nextTheme);
    dispatch(setTheme(nextTheme));
  };

  return (
    <TouchableOpacity
      onPress={handleToggleTheme}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`w-9 h-9 rounded-full bg-secondary/40 border border-border items-center justify-center ${className}`}
    >
      {isDark ? (
        <Sun size={size} color="#f2c14e" />
      ) : (
        <Moon size={size} color="#2f5d50" />
      )}
    </TouchableOpacity>
  );
}

export default ThemeToggle;
