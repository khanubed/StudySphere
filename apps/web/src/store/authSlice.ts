import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@studysphere/shared-types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  tokenUsageLimit: number;
  tokenUsageUsed: number;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  tokenUsageLimit: 0,
  tokenUsageUsed: 0,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateTokenUsage: (state, action: PayloadAction<{ used: number; limit: number }>) => {
      state.tokenUsageUsed = action.payload.used;
      state.tokenUsageLimit = action.payload.limit;
    },
  },
});

export const { setCredentials, clearCredentials, updateTokenUsage } = authSlice.actions;
export default authSlice.reducer;
