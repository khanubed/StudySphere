import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileUIState {
  theme: 'light' | 'dark' | 'system';
  activeBottomSheet: string | null;
  bottomSheetData: Record<string, any> | null;
  offlineBannerVisible: boolean;
}

const initialState: MobileUIState = {
  theme: 'system',
  activeBottomSheet: null,
  bottomSheetData: null,
  offlineBannerVisible: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    openBottomSheet: (
      state,
      action: PayloadAction<{ sheetId: string; data?: Record<string, any> }>
    ) => {
      state.activeBottomSheet = action.payload.sheetId;
      state.bottomSheetData = action.payload.data || null;
    },
    closeBottomSheet: (state) => {
      state.activeBottomSheet = null;
      state.bottomSheetData = null;
    },
    setOfflineBannerVisible: (state, action: PayloadAction<boolean>) => {
      state.offlineBannerVisible = action.payload;
    },
  },
});

export const {
  setTheme,
  openBottomSheet,
  closeBottomSheet,
  setOfflineBannerVisible,
} = uiSlice.actions;

export default uiSlice.reducer;
