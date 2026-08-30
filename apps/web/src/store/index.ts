import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import quizReducer from './slices/quizSlice';
import plannerReducer from './slices/plannerSlice';
import resourceReducer from './slices/resourceSlice';
import careerReducer from './slices/careerSlice';
import codingHubReducer from './slices/codingHubSlice';
import notificationReducer from './slices/notificationSlice';
import summarizerReducer from './slices/summarizerSlice';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    quiz: quizReducer,
    planner: plannerReducer,
    resource: resourceReducer,
    career: careerReducer,
    codingHub: codingHubReducer,
    notification: notificationReducer,
    summarizer: summarizerReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './hooks';
export * from './slices/authSlice';
export * from './slices/uiSlice';
export * from './slices/quizSlice';
export * from './slices/plannerSlice';
export * from './slices/resourceSlice';
export * from './slices/careerSlice';
export * from './slices/codingHubSlice';
export * from './slices/notificationSlice';
export * from './slices/summarizerSlice';
export * from './api';
