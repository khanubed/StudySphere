import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api/v1',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('token')
          : null;
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
