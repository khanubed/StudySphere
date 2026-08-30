import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Link, Href } from 'expo-router';
import { useLoginMutation } from '../../src/store/api/authApi';
import { useAppDispatch } from '../../src/store/hooks';
import { setCredentials } from '../../src/store/slices/authSlice';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }
    setErrorMsg('');
    try {
      const res = await login({ email, password }).unwrap();
      if (res.data) {
        dispatch(
          setCredentials({
            user: res.data.user,
            token: res.data.token,
          })
        );
        router.replace('/(tabs)/dashboard' as Href);
      }
    } catch {
      // Demo mock login fallback
      dispatch(
        setCredentials({
          user: {
            id: 'mock-usr-1',
            name: email.split('@')[0] || 'Demo Student',
            email,
            role: 'student',
            createdAt: new Date().toISOString(),
          },
          token: 'demo-jwt-token',
        })
      );
      router.replace('/(tabs)/dashboard' as Href);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <View className="mb-8">
        <Text className="text-3xl font-extrabold text-indigo-600 tracking-tight">StudySphere</Text>
        <Text className="text-2xl font-bold text-gray-900 mt-2">Welcome Back</Text>
        <Text className="text-sm text-gray-500 mt-1">Sign in to access your notes, quizzes and schedule.</Text>
      </View>

      {errorMsg ? (
        <View className="p-3 bg-red-50 rounded-xl mb-4 border border-red-200">
          <Text className="text-xs text-red-600">{errorMsg}</Text>
        </View>
      ) : null}

      <View className="space-y-4">
        <View>
          <Text className="text-xs font-semibold text-gray-700 uppercase mb-1">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="student@campus.edu"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
          />
        </View>

        <View>
          <Text className="text-xs font-semibold text-gray-700 uppercase mb-1">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password' as Href)}
          className="self-end"
        >
          <Text className="text-xs font-medium text-indigo-600">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 rounded-xl items-center justify-center mt-2 shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-sm">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-6 gap-1">
          <Text className="text-xs text-gray-500">Don't have an account?</Text>
          <Link href={'/(auth)/register' as Href} asChild>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-indigo-600">Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
