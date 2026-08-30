import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index.ts';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.EXPO_PUBLIC_API_URL ||
      'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Auth',
    'User',
    'Profile',
    'Dashboard',
    'Resource',
    'AI',
    'Quiz',
    'Assignment',
    'Planner',
    'Career',
    'Alumni',
    'CodingHub',
    'Faculty',
    'LiveQuiz',
    'Notification',
    'Admin',
    'Billing',
    'Job',
  ],
  endpoints: () => ({}),
});
