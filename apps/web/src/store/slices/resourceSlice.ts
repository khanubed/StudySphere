import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceType, ResourceStatus, LeaderboardScope } from '@studysphere/shared-types';

export interface ResourceFilterState {
  searchQuery: string;
  selectedBranch: string | null;
  selectedSemester: number | null;
  selectedSubject: string | null;
  resourceType: ResourceType | 'all';
  verificationFilter: 'all' | 'verified' | 'faculty';
  sortBy: 'latest' | 'popular' | 'downloads' | 'rating';
  leaderboardScope: LeaderboardScope;
  myResourcesTab: ResourceStatus | 'all';
}

const initialState: ResourceFilterState = {
  searchQuery: '',
  selectedBranch: null,
  selectedSemester: null,
  selectedSubject: null,
  resourceType: 'all',
  verificationFilter: 'all',
  sortBy: 'latest',
  leaderboardScope: 'weekly',
  myResourcesTab: 'all',
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
    setResourceType: (state, action: PayloadAction<ResourceType | 'all'>) => {
      state.resourceType = action.payload;
    },
    setVerificationFilter: (
      state,
      action: PayloadAction<'all' | 'verified' | 'faculty'>
    ) => {
      state.verificationFilter = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<'latest' | 'popular' | 'downloads' | 'rating'>
    ) => {
      state.sortBy = action.payload;
    },
    setLeaderboardScope: (state, action: PayloadAction<LeaderboardScope>) => {
      state.leaderboardScope = action.payload;
    },
    setMyResourcesTab: (
      state,
      action: PayloadAction<ResourceStatus | 'all'>
    ) => {
      state.myResourcesTab = action.payload;
    },
    resetResourceFilters: (state) => {
      state.searchQuery = '';
      state.selectedBranch = null;
      state.selectedSemester = null;
      state.selectedSubject = null;
      state.resourceType = 'all';
      state.verificationFilter = 'all';
      state.sortBy = 'latest';
    },
  },
});

export const {
  setSearchQuery,
  setSelectedBranch,
  setSelectedSemester,
  setSelectedSubject,
  setResourceType,
  setVerificationFilter,
  setSortBy,
  setLeaderboardScope,
  setMyResourcesTab,
  resetResourceFilters,
} = resourceSlice.actions;

export default resourceSlice.reducer;

