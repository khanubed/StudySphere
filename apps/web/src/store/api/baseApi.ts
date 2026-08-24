import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['User', 'Resource', 'Quiz', 'Planner', 'Notification', 'Job'],
  endpoints: () => ({}),
});
