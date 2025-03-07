import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseObjectInputType } from "zod";

interface AiState {
  disabled: boolean;
  question_id: number;
  selected_answers: number[];
  selected_category: any;
  answer_colors: {
    [key: number]:
      | "primary"
      | "secondary"
      | "success"
      | "danger"
      | "warning"
      | "default";
  };
  answers: string[];
  debuggers: any[];
}

const initialState: AiState = {
  disabled: true,
  question_id: 0,
  selected_answers: [],
  selected_category: null,
  answer_colors: {}, // ✅ ذخیره رنگ‌ها
  answers: [],
  debuggers: [],
};

const aiSlice = createSlice({
  name: "aiQuestion",
  initialState,
  reducers: {
    setContinue: (state, action: PayloadAction<boolean>) => {
      state.disabled = action.payload;
    },
    showQuestion: (state, action: PayloadAction<number>) => {
      state.question_id = action.payload;
      state.selected_answers = []; // ✅ وقتی سوال تغییر کرد، پاسخ‌ها ریست شوند
    },
    toggleAnswer: (state, action: PayloadAction<number>) => {
      if (state.selected_answers.includes(action.payload)) {
        state.selected_answers = state.selected_answers.filter(
          (id) => id !== action.payload
        );
      } else {
        state.selected_answers.push(action.payload);
      }
    },
    addAnswer: (state, action: PayloadAction<string>) => {
      if (state.answers.includes(action.payload)) {
        // اگر رشته وجود داشت، آن را حذف کن
        state.answers = state.answers.filter(
          (answer) => answer !== action.payload
        );
      } else {
        // اگر رشته وجود نداشت، آن را اضافه کن
        state.answers.push(action.payload);
      }
    },
    setSelectedCategory: (state, action: PayloadAction<any>) => {
      state.selected_category = action.payload;
    },
    setAnswerColors: (
      state,
      action: PayloadAction<{
        [key: number]:
          | "primary"
          | "secondary"
          | "success"
          | "danger"
          | "warning"
          | "default";
      }>
    ) => {
      state.answer_colors = action.payload;
    },
    setDebuggers: (state, action) => {
      state.debuggers = action.payload;
    },
  },
});

export const {
  showQuestion,
  toggleAnswer,
  setSelectedCategory,
  setAnswerColors,
  addAnswer,
  setDebuggers,
  setContinue,
} = aiSlice.actions;
export default aiSlice.reducer;
