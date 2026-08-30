import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Link, Href } from 'expo-router';
import { useRegisterMutation } from '../../src/store/api/authApi';
import { useAppDispatch } from '../../src/store/hooks';
import { setCredentials } from '../../src/store/slices/authSlice';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleRegister = async () => {
    try {
      const res = await registerMutation({ name, email, password, role: 'student' }).unwrap();
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
      // Demo mock fallback
      dispatch(
        setCredentials({
          user: {
            id: 'mock-usr-2',
            name: name || 'Demo Student',
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
        <Text className="text-2xl font-bold text-gray-900 mt-2">Create Account</Text>
        <Text className="text-sm text-gray-500 mt-1">Join your campus academic ecosystem.</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-xs font-semibold text-gray-700 uppercase mb-1">Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Jane Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
          />
        </View>

        <View>
          <Text className="text-xs font-semibold text-gray-700 uppercase mb-1">College Email</Text>
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
          onPress={handleRegister}
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 rounded-xl items-center justify-center mt-2 shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-sm">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-6 gap-1">
          <Text className="text-xs text-gray-500">Already registered?</Text>
          <Link href={'/(auth)/login' as Href} asChild>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-indigo-600">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
