import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SummaryDepth } from '@studysphere/shared-types';

export interface SummarizerState {
  activeSessionId: string | null;
  activeSummaryTab: 'short' | 'detailed';
  activeAssetAccordion: 'notes' | 'flashcards' | 'questions' | 'mindmap';
  selectedDepth: SummaryDepth;
  flashcardIndex: number;
  isCardFlipped: boolean;
  masteredCards: string[];
  filterQuestionType: 'all' | 'short' | 'long' | 'viva';
  searchQuery: string;
}

const initialState: SummarizerState = {
  activeSessionId: 'sum-ses-001',
  activeSummaryTab: 'detailed',
  activeAssetAccordion: 'notes',
  selectedDepth: 'detailed',
  flashcardIndex: 0,
  isCardFlipped: false,
  masteredCards: ['fc-01', 'fc-03'],
  filterQuestionType: 'all',
  searchQuery: '',
};

export const summarizerSlice = createSlice({
  name: 'summarizer',
  initialState,
  reducers: {
    setActiveSessionId: (state, action: PayloadAction<string | null>) => {
      state.activeSessionId = action.payload;
      state.flashcardIndex = 0;
      state.isCardFlipped = false;
    },
    setActiveSummaryTab: (state, action: PayloadAction<'short' | 'detailed'>) => {
      state.activeSummaryTab = action.payload;
    },
    setActiveAssetAccordion: (
      state,
      action: PayloadAction<'notes' | 'flashcards' | 'questions' | 'mindmap'>
    ) => {
      state.activeAssetAccordion = action.payload;
    },
    setSelectedDepth: (state, action: PayloadAction<SummaryDepth>) => {
      state.selectedDepth = action.payload;
    },
    setFlashcardIndex: (state, action: PayloadAction<number>) => {
      state.flashcardIndex = action.payload;
      state.isCardFlipped = false;
    },
    toggleCardFlip: (state) => {
      state.isCardFlipped = !state.isCardFlipped;
    },
    setCardFlipped: (state, action: PayloadAction<boolean>) => {
      state.isCardFlipped = action.payload;
    },
    toggleCardMastery: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      if (state.masteredCards.includes(cardId)) {
        state.masteredCards = state.masteredCards.filter((id) => id !== cardId);
      } else {
        state.masteredCards.push(cardId);
      }
    },
    setFilterQuestionType: (
      state,
      action: PayloadAction<'all' | 'short' | 'long' | 'viva'>
    ) => {
      state.filterQuestionType = action.payload;
    },
    setSummarizerSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetSummarizerState: () => initialState,
  },
});

export const {
  setActiveSessionId,
  setActiveSummaryTab,
  setActiveAssetAccordion,
  setSelectedDepth,
  setFlashcardIndex,
  toggleCardFlip,
  setCardFlipped,
  toggleCardMastery,
  setFilterQuestionType,
  setSummarizerSearchQuery,
  resetSummarizerState,
} = summarizerSlice.actions;

export default summarizerSlice.reducer;
