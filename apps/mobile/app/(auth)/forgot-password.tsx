import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-xs font-semibold text-indigo-600">← Back to Login</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-gray-900">Reset Password</Text>
      <Text className="text-sm text-gray-500 mt-1 mb-6">
        Enter your registered email to receive a password reset link.
      </Text>

      {sent ? (
        <View className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 items-center space-y-2">
          <Text className="text-sm font-bold text-indigo-900">Reset Link Dispatched</Text>
          <Text className="text-xs text-gray-600 text-center">
            Check your inbox at {email} for instructions to reset your account password.
          </Text>
        </View>
      ) : (
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

          <TouchableOpacity
            onPress={() => email && setSent(true)}
            className="w-full py-4 bg-indigo-600 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white font-bold text-sm">Send Reset Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
