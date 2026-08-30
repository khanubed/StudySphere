import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileDraftTask {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  subjectId?: string;
}

export interface MobilePlannerState {
  selectedDate: string;
  viewMode: 'day' | 'week' | 'month';
  draftTask: MobileDraftTask | null;
  taskFilter: 'all' | 'pending' | 'completed';
}

const initialState: MobilePlannerState = {
  selectedDate: new Date().toISOString().split('T')[0],
  viewMode: 'week',
  draftTask: null,
  taskFilter: 'all',
};

export const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'day' | 'week' | 'month'>) => {
      state.viewMode = action.payload;
    },
    setDraftTask: (state, action: PayloadAction<MobileDraftTask | null>) => {
      state.draftTask = action.payload;
    },
    updateDraftTask: (
      state,
      action: PayloadAction<Partial<MobileDraftTask>>
    ) => {
      if (state.draftTask) {
        state.draftTask = { ...state.draftTask, ...action.payload };
      } else {
        state.draftTask = { title: '', ...action.payload };
      }
    },
    clearDraftTask: (state) => {
      state.draftTask = null;
    },
    setTaskFilter: (
      state,
      action: PayloadAction<'all' | 'pending' | 'completed'>
    ) => {
      state.taskFilter = action.payload;
    },
  },
});

export const {
  setSelectedDate,
  setViewMode,
  setDraftTask,
  updateDraftTask,
  clearDraftTask,
  setTaskFilter,
} = plannerSlice.actions;

export default plannerSlice.reducer;
