  // store/slices/counterSlice.ts
  import { createSlice, PayloadAction } from '@reduxjs/toolkit';

  interface CounterState {
    value: number;
    sign_up:boolean;
    login:boolean;
    side:boolean;
    showRequest:boolean;
    more_request:boolean;
    find_user:boolean;
  }

  const initialState: CounterState = {
    value: 0,
    sign_up:false,
    login:false,
    side:true,
    showRequest:false,
    more_request:false,
    find_user:false

  };

  const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
      showSignUp: (state,action) => {
      state.login = false
      state.sign_up = action.payload;
      },
      showLogin: (state,action:PayloadAction<boolean>) => {

      state.sign_up = false;
      state.login = action.payload;
      },
      incrementByAmount: (state, action: PayloadAction<number>) => {
        state.value += action.payload;
      },
      OpenSideBar:(state,action:PayloadAction<boolean>)=>{
        state.side = action.payload
      },
      setShowRequest:(state,action:PayloadAction<boolean>)=>{
        state.showRequest = action.payload
      },
      showMoreRequest:(state,action:PayloadAction<boolean>)=>{
        state.more_request = action.payload
      },
      setFindUser:(state,action:PayloadAction<boolean>)=>{
        state.find_user = action.payload
      }
    },
  });

  export const { showLogin, showSignUp, incrementByAmount,OpenSideBar,showMoreRequest,setShowRequest,setFindUser } = globalSlice.actions;
  export default globalSlice.reducer;
