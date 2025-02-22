// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import counterReducer from '../slices/counterSlice';
import userReducer from '../slices/userSlice'
import chatReducer from '../slices/chatSlice'
import consultReducer from '../slices/consultSlice'
import feedbackReducer from '../slices/feedbackSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user:userReducer,
    chat:chatReducer,
    consult:consultReducer,
    feedback:feedbackReducer

  },
});

// Infer types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Hooks for usage in components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
