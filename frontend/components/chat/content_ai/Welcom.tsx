"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import AiMesage from "./AiMesage"; // Using your existing message component
import AiContent from ".";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { setConversation, setDelay, setSelectedCategory } from "@/redux/slices/aiSlice";
import { useSearchParams } from "next/navigation";
import {Questions} from '@/data/AIQuestion'
import ChatWithAi from "../send_ai";
const AiWelcome: React.FC = () => {
  const [started, setStarted] = useState(false);
  const { selected_category } = useAppSelector(
    (state: RootState) => state.aiQuestion
  );
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const dispatch = useAppDispatch();

  const handleQuestion = () => {
    const filterMode = Questions.find((item)=>item.category == "starter")
    console.log(filterMode)
    
    setStarted(true);
    dispatch(

      setConversation({
        ai:true,
        message:filterMode?.questions[0].question || ''
      })
    
    )
    dispatch(setDelay({
      state:true,
      message:filterMode?.questions[0].question || ''
    }))
    dispatch(setSelectedCategory(filterMode))
   setTimeout(()=>{
    dispatch(setDelay({
      state:false,
      message:''
    }))
   },1500)
    

  };

  if (started) {
    return (
    <AiContent />
    )
  }

  return (
    <div className="w-full mx-auto h-full flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="text-7xl animate-pulse">🎉</span>
          <h1 className="text-4xl my-2">خوش آمدید</h1>
          <p>
            در نهایت، مشکل برنامه نویسی شما حل شدنیه! با ما همراه باشید تا بدون
            دردسر، سریع و دقیق، مشکل شما را بررسی و حل کنیم
            <br />
            <br />
            بیایید با یک پرسش و پاسخ سریع برای پیدا کردن متخصص مناسب شروع کنیم.
          </p>
        </div>

        {/* <AiMesage message="به سیستم هوش مصنوعی خوش آمدید" audio="" /> */}

        <div className="my-8">
          <p className="text-gray-600 mb-4">
            لطفاً برای شروع پاسخگویی به سوالات روی دکمه زیر کلیک کنید.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="solid"
              color="secondary"
              className="w-full py-3"
              onPress={handleQuestion}
            >
              شروع
            </Button>
          </motion.div>
        </div>

      </motion.div>

    </div>
  );
};

export default AiWelcome;
