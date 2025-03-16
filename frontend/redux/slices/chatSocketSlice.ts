import { Main } from "@/components/types/testChat.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseObjectInputType } from "zod";




const initialState: Main[] = []; // مقدار اولیه یک آرایه از چت‌ها است

const aiSlice = createSlice({
  name: "chatSocket",
  initialState,
  reducers: {
    setData:(state,action:PayloadAction<any>)=>{
    return action.payload
    },
    setMessage: (state, action: PayloadAction<any>) => {
      state.push(action.payload);
    },

    setSatus:(state,action:PayloadAction<{id:string,status: "sent" | "pending" | "recieved"}>)=>{
        const msgIndex = state.findIndex((item) => item.id === action.payload.id); // پیدا کردن ایتم بر اساس id
        if (msgIndex !== -1) { // اگر پیام پیدا شد
          state[msgIndex].data.status = action.payload.status; // آپدیت وضعیت پیام
        }
    },
    setRead :(state)=>{
      state.forEach((item) => {
        if (item.data.status === "sent") {
          item.data.status = "recieved"; // تغییر وضعیت پیام به "recieved"
        }
      });
    }
  },
});

export const { setMessage,setSatus,setRead ,setData} = aiSlice.actions;
export default aiSlice.reducer;