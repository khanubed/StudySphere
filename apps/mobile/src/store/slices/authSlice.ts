import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@studysphere/shared-types';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  tokenUsageLimit: number;
  tokenUsageUsed: number;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  tokenUsageLimit: 0,
  tokenUsageUsed: 0,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserProfile; token?: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.token) {
        state.token = action.payload.token;
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tokenUsageLimit = 0;
      state.tokenUsageUsed = 0;
    },
    updateTokenUsage: (
      state,
      action: PayloadAction<{ used: number; limit: number }>
    ) => {
      state.tokenUsageUsed = action.payload.used;
      state.tokenUsageLimit = action.payload.limit;
    },
  },
});

export const { setCredentials, setToken, clearCredentials, updateTokenUsage } =
  authSlice.actions;
export default authSlice.reducer;
