import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseObjectInputType } from "zod";

interface AnswerProps {
  id: number;
  answer: string;
}

interface Conversation {
  ai: boolean;
  message: string;
  analyze?: boolean;
}

interface Delay {
  state: boolean;
  message: string;
}

interface AiState {
  disabled: boolean;
  question_id: number;
  selected_answers: number[];
  addedAnswers: AnswerProps[];
  selected_category: any;
  description: string;
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
  is_last_question: boolean;
  conversation: Conversation[];
  delay: Delay;
}

const initialState: AiState = {
  description: "",
  addedAnswers: [],
  disabled: true,
  question_id: 0,
  selected_answers: [],
  selected_category: null,
  answer_colors: {},
  answers: [],
  debuggers: [],
  is_last_question: false,
  conversation: [],
  delay: {
    state: false,
    message: "",
  },
};

const aiSlice = createSlice({
  name: "aiQuestion",
  initialState,
  reducers: {
    addCustomAnswer: (state, action: PayloadAction<AnswerProps>) => {
      state.addedAnswers.push(action.payload);
      state.selected_answers.push(action.payload.id); // ✅ پیش‌فرض انتخاب‌شده
    },
    clearAddedAnswers: (state) => {
      state.addedAnswers = []; // ✅ پاک کردن پاسخ‌های اضافه‌شده هنگام تغییر سوال
    },
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
    setLastQuestion: (state, action: PayloadAction<boolean>) => {
      state.is_last_question = action.payload;
    },
    setConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversation.push(action.payload);
    },
    setDelay: (state, action: PayloadAction<Delay>) => {
      state.delay = action.payload;
    },

    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addSelectedAnswerToCustom: (state, action: PayloadAction<string>) => {
      if (!state.answers.includes(action.payload)) {
        state.answers.push(action.payload);
      }
    },
    setAnalyze: (state, action: PayloadAction<Conversation>) => {
      state.conversation.push(action.payload);
    },
    setClearAi: (state) => {
      (state.description = ""),
        (state.addedAnswers = []),
        (state.disabled = true),
        (state.question_id = 0),
        (state.selected_answers = []),
        (state.selected_category = "starter"),
        (state.answer_colors = {}),
        (state.answers = []),
        (state.debuggers = []),
        (state.is_last_question = false),
        (state.conversation = []),
        (state.delay = {
          state: false,
          message: "",
        });
    },
  },
});

export const {
  showQuestion,
  setClearAi,
  toggleAnswer,
  setSelectedCategory,
  setAnswerColors,
  addAnswer,
  setDebuggers,
  setContinue,
  setLastQuestion,
  setConversation,
  setDelay,
  addCustomAnswer,
  clearAddedAnswers,
  addSelectedAnswerToCustom,
  setAnalyze,
} = aiSlice.actions;
export default aiSlice.reducer;
