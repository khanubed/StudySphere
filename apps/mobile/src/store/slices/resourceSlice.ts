import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileResourceFilterState {
  searchQuery: string;
  selectedBranch: string | null;
  selectedSemester: number | null;
  selectedSubject: string | null;
  resourceType: string | null;
  sortBy: 'latest' | 'popular' | 'downloads' | 'rating';
}

const initialState: MobileResourceFilterState = {
  searchQuery: '',
  selectedBranch: null,
  selectedSemester: null,
  selectedSubject: null,
  resourceType: null,
  sortBy: 'latest',
};

export const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedBranch: (state, action: PayloadAction<string | null>) => {
      state.selectedBranch = action.payload;
    },
    setSelectedSemester: (state, action: PayloadAction<number | null>) => {
      state.selectedSemester = action.payload;
    },
    setSelectedSubject: (state, action: PayloadAction<string | null>) => {
      state.selectedSubject = action.payload;
    },
    setResourceType: (state, action: PayloadAction<string | null>) => {
      state.resourceType = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<'latest' | 'popular' | 'downloads' | 'rating'>
    ) => {
      state.sortBy = action.payload;
    },
    resetResourceFilters: () => initialState,
  },
});

export const {
  setSearchQuery,
  setSelectedBranch,
  setSelectedSemester,
  setSelectedSubject,
  setResourceType,
  setSortBy,
  resetResourceFilters,
} = resourceSlice.actions;

export default resourceSlice.reducer;
