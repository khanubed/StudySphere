import { baseApi } from './baseApi';
import {
  LiveQuizSession,
  LiveQuizLeaderboardItem,
  LiveQuizWebSocketEvent,
  ApiResponse,
} from '@studysphere/shared-types';
import { io, Socket } from 'socket.io-client';

export interface CreateLiveQuizRequest {
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
  timePerQuestionSec?: number;
}

export const liveQuizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLiveQuizSession: builder.query<ApiResponse<LiveQuizSession>, string>({
      query: (sessionId) => `/live-quiz/sessions/${sessionId}`,
      providesTags: (_result, _error, id) => [{ type: 'LiveQuiz', id }],
      async onCacheEntryAdded(
        sessionId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let socket: Socket | null = null;
        try {
          await cacheDataLoaded;
          const socketUrl =
            import.meta.env.VITE_WS_URL ||
            window.location.origin.replace(/^http/, 'ws');
          socket = io(`${socketUrl}/live-quiz`, {
            query: { sessionId },
            transports: ['websocket'],
          });

          socket.on('quiz_event', (event: LiveQuizWebSocketEvent) => {
            updateCachedData((draft) => {
              if (!draft.data) return;
              if (event.type === 'PARTICIPANT_JOINED') {
                draft.data.participants = draft.data.participants || [];
                draft.data.participants.push(event.participant);
              } else if (event.type === 'PARTICIPANT_LEFT') {
                if (draft.data.participants) {
                  draft.data.participants = draft.data.participants.filter(
                    (p) => p.userId !== event.userId
                  );
                }
              } else if (event.type === 'SESSION_START') {
                draft.data.state = 'active';
              } else if (event.type === 'NEXT_QUESTION') {
                draft.data.currentQuestionIndex = event.questionIndex;
              } else if (event.type === 'QUIZ_ENDED') {
                draft.data.state = 'completed';
              }
            });
          });
        } catch {
          // Socket failed or connection closed
        }
        await cacheEntryRemoved;
        if (socket) {
          socket.disconnect();
        }
      },
    }),
    createLiveQuizSession: builder.mutation<
      ApiResponse<LiveQuizSession>,
      CreateLiveQuizRequest
    >({
      query: (body) => ({
        url: '/live-quiz/sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LiveQuiz'],
    }),
    joinLiveQuizByCode: builder.mutation<
      ApiResponse<LiveQuizSession>,
      { joinCode: string }
    >({
      query: (body) => ({
        url: '/live-quiz/join',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LiveQuiz'],
    }),
    getLiveQuizLeaderboard: builder.query<
      ApiResponse<LiveQuizLeaderboardItem[]>,
      string
    >({
      query: (sessionId) => `/live-quiz/sessions/${sessionId}/leaderboard`,
      providesTags: (_result, _error, sessionId) => [
        { type: 'LiveQuiz', id: `LEADERBOARD_${sessionId}` },
      ],
      async onCacheEntryAdded(
        sessionId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let socket: Socket | null = null;
        try {
          await cacheDataLoaded;
          const socketUrl =
            import.meta.env.VITE_WS_URL ||
            window.location.origin.replace(/^http/, 'ws');
          socket = io(`${socketUrl}/live-quiz`, {
            query: { sessionId },
            transports: ['websocket'],
          });

          socket.on('quiz_event', (event: LiveQuizWebSocketEvent) => {
            if (
              event.type === 'LEADERBOARD_UPDATE' ||
              event.type === 'QUIZ_ENDED'
            ) {
              const updated =
                event.type === 'LEADERBOARD_UPDATE'
                  ? event.leaderboard
                  : event.finalLeaderboard;
              updateCachedData((draft) => {
                draft.data = updated;
              });
            }
          });
        } catch {
          // Ignore
        }
        await cacheEntryRemoved;
        if (socket) {
          socket.disconnect();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLiveQuizSessionQuery,
  useCreateLiveQuizSessionMutation,
  useJoinLiveQuizByCodeMutation,
  useGetLiveQuizLeaderboardQuery,
} = liveQuizApi;
