import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const rootReducer = combineReducers({
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
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'ui', 'planner', 'summarizer'], // persist auth, ui, planner, summarizer offline
  blacklist: [baseApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
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

