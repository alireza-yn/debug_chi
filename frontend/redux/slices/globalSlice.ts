// store/slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  sign_up:boolean;
  login:boolean;
}

const initialState: CounterState = {
  value: 0,
  sign_up:false,
  login:false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {

    showSignUp: (state,action) => {
    state.login = false
    state.sign_up = action.payload;

    },
    showLogin: (state,action) => {

    state.sign_up = false;
    state.login = action.payload;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { showLogin, showSignUp, incrementByAmount } = globalSlice.actions;
export default globalSlice.reducer;
