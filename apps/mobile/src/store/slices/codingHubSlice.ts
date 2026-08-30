import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileCodingHubState {
  selectedTrack: string | null;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  searchQuery: string;
  activeProblemId: string | null;
  activeLanguage: string;
}

const initialState: MobileCodingHubState = {
  selectedTrack: null,
  difficulty: 'all',
  searchQuery: '',
  activeProblemId: null,
  activeLanguage: 'javascript',
};

export const codingHubSlice = createSlice({
  name: 'codingHub',
  initialState,
  reducers: {
    setSelectedTrack: (state, action: PayloadAction<string | null>) => {
      state.selectedTrack = action.payload;
    },
    setCodingDifficulty: (
      state,
      action: PayloadAction<'all' | 'easy' | 'medium' | 'hard'>
    ) => {
      state.difficulty = action.payload;
    },
    setCodingSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveProblemId: (state, action: PayloadAction<string | null>) => {
      state.activeProblemId = action.payload;
    },
    setActiveLanguage: (state, action: PayloadAction<string>) => {
      state.activeLanguage = action.payload;
    },
    resetCodingFilters: (state) => {
      state.selectedTrack = null;
      state.difficulty = 'all';
      state.searchQuery = '';
    },
  },
});

export const {
  setSelectedTrack,
  setCodingDifficulty,
  setCodingSearchQuery,
  setActiveProblemId,
  setActiveLanguage,
  resetCodingFilters,
} = codingHubSlice.actions;

export default codingHubSlice.reducer;
