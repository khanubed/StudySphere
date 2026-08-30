import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileCareerState {
  searchQuery: string;
  jobType: 'all' | 'internship' | 'fulltime' | 'parttime';
  locationFilter: string | null;
  experienceLevel: 'all' | 'entry' | 'mid' | 'senior';
  activeTab: 'jobs' | 'applications' | 'mentorship';
}

const initialState: MobileCareerState = {
  searchQuery: '',
  jobType: 'all',
  locationFilter: null,
  experienceLevel: 'all',
  activeTab: 'jobs',
};

export const careerSlice = createSlice({
  name: 'career',
  initialState,
  reducers: {
    setCareerSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setJobType: (
      state,
      action: PayloadAction<'all' | 'internship' | 'fulltime' | 'parttime'>
    ) => {
      state.jobType = action.payload;
    },
    setLocationFilter: (state, action: PayloadAction<string | null>) => {
      state.locationFilter = action.payload;
    },
    setExperienceLevel: (
      state,
      action: PayloadAction<'all' | 'entry' | 'mid' | 'senior'>
    ) => {
      state.experienceLevel = action.payload;
    },
    setCareerActiveTab: (
      state,
      action: PayloadAction<'jobs' | 'applications' | 'mentorship'>
    ) => {
      state.activeTab = action.payload;
    },
    resetCareerFilters: (state) => {
      state.searchQuery = '';
      state.jobType = 'all';
      state.locationFilter = null;
      state.experienceLevel = 'all';
    },
  },
});

export const {
  setCareerSearchQuery,
  setJobType,
  setLocationFilter,
  setExperienceLevel,
  setCareerActiveTab,
  resetCareerFilters,
} = careerSlice.actions;

export default careerSlice.reducer;
