import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CodingHubState {
  selectedTrack: string | null;
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  searchQuery: string;
  activeProblemId: string | null;
  activeLanguage: string;
  codeDrafts: Record<string, string>; // problemId -> code string
}

const initialState: CodingHubState = {
  selectedTrack: null,
  difficulty: 'all',
  searchQuery: '',
  activeProblemId: null,
  activeLanguage: 'javascript',
  codeDrafts: {},
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
    saveCodeDraft: (
      state,
      action: PayloadAction<{ problemId: string; code: string }>
    ) => {
      state.codeDrafts[action.payload.problemId] = action.payload.code;
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
  saveCodeDraft,
  resetCodingFilters,
} = codingHubSlice.actions;

export default codingHubSlice.reducer;
