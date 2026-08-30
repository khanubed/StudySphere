import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MobileQuizAttemptState {
  quizId: string | null;
  currentQuestionIndex: number;
  answers: Record<string, string | number | boolean | string[]>;
  markedForReview: string[];
  timeRemainingSeconds: number;
  isSubmitting: boolean;
}

const initialState: MobileQuizAttemptState = {
  quizId: null,
  currentQuestionIndex: 0,
  answers: {},
  markedForReview: [],
  timeRemainingSeconds: 0,
  isSubmitting: false,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuizAttempt: (
      state,
      action: PayloadAction<{
        quizId: string;
        durationSeconds?: number;
      }>
    ) => {
      state.quizId = action.payload.quizId;
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.markedForReview = [];
      state.timeRemainingSeconds = action.payload.durationSeconds || 0;
      state.isSubmitting = false;
    },
    setAnswer: (
      state,
      action: PayloadAction<{
        questionId: string;
        answer: string | number | boolean | string[];
      }>
    ) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    toggleMarkForReview: (state, action: PayloadAction<string>) => {
      const questionId = action.payload;
      if (state.markedForReview.includes(questionId)) {
        state.markedForReview = state.markedForReview.filter(
          (id) => id !== questionId
        );
      } else {
        state.markedForReview.push(questionId);
      }
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemainingSeconds = action.payload;
    },
    decrementTime: (state) => {
      if (state.timeRemainingSeconds > 0) {
        state.timeRemainingSeconds -= 1;
      }
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    resetQuizAttempt: (state) => {
      state.quizId = null;
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.markedForReview = [];
      state.timeRemainingSeconds = 0;
      state.isSubmitting = false;
    },
  },
});

export const {
  startQuizAttempt,
  setAnswer,
  toggleMarkForReview,
  setCurrentQuestionIndex,
  nextQuestion,
  prevQuestion,
  setTimeRemaining,
  decrementTime,
  setIsSubmitting,
  resetQuizAttempt,
} = quizSlice.actions;

export default quizSlice.reducer;
