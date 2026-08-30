import React from 'react';
import { Redirect, Href } from 'expo-router';
import { useAppSelector } from '../src/store/hooks';

export default function Index() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Redirect href={'/(auth)/login' as Href} />;
  }

  return <Redirect href={'/(tabs)/dashboard' as Href} />;
}
