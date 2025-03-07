"use client";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { Button, Textarea } from "@heroui/react";
import {
  setContinue,
  setDebuggers,
  showQuestion,
} from "@/redux/slices/aiSlice";
import React, { useState } from "react";
import { perform_get } from "@/lib/api";
import axios from "axios";



const AddDescription = () => {
  return (
    <div className="flex items-center justify-center">
      <Textarea 
      minRows={4}
      maxRows={6}
      label="اگر توضیحاتی دارید وارد کنید"
      
      />
    </div>
  )
}






const ChatWithAi = () => {
  const dispatch = useAppDispatch();
  const {
    question_id,
    selected_answers,
    selected_category,
    answers,
    disabled,
  } = useAppSelector((state) => state.aiQuestion);
  const [loading, setLoading] = useState(false);

  const handleNextQuestion = () => {
    if (selected_category) {
      const nextQuestionId = question_id + 1;
      if (nextQuestionId < selected_category.questions.length) {
        dispatch(showQuestion(nextQuestionId));
      }
    }
  };

  const handleGemminiRequest = async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    setLoading(true);
    try {
      await delay(1000);
      const users = await perform_get("auths/register/");

      const prompt = `
        این کلید واژه های من هست طبق این کلید ها ${JSON.stringify(
          answers,
          null,
          2
        )}
        کاربرای زیر رو ${JSON.stringify(
          users,
          null,
          2
        )} انالیز کن بهترین افرادی که میتونن کمک کنن رو پیدا کن و فقط بصورت JSON خروجی بده. فقط json باشه هیچ داد ی دیگه ای نده با اسم ابجکت result برگزدون
      `;

      const requestData = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-exp-02-05:generateContent?key=AIzaSyAFXCHBmGarSnReCA8Mqu_EFskVcPyWHCc",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response Data:", response.data);

      // اصلاح مسیر دسترسی به پاسخ API
      let rawText = response.data.candidates[0].content.parts[0].text;
      rawText = rawText.replace(/```json|```/g, "").trim();
      const parsedDebuggers = JSON.parse(rawText);
      console.log(parsedDebuggers);
      dispatch(setDebuggers(parsedDebuggers));
      console.log("Parsed Debuggers:", parsedDebuggers);
    } catch (error) {
      console.error("Error fetching debuggers:", error);
    } finally {
      setLoading(false);
    }
  };

  const isLastQuestion =
    selected_category && question_id === selected_category.questions.length - 1;

  return (
    <div className="w-full flex items-center justify-center mx-auto h-20 mb-10 ">
      {isLastQuestion ? (
        <Button
          isLoading={loading}
          className="w-2/4 h-full"
          onPress={handleGemminiRequest}
        >
          آنالیز و پیدا کردن
        </Button>
      ) : (
        <Button
          isDisabled={disabled}
          color="primary"
          className="w-2/4 h-full mb-10"
          onPress={() => {
            handleNextQuestion();
            dispatch(setContinue(true));
          }}
          disabled={selected_answers.length === 0}
        >
          ادامه دادن
        </Button>
      )}

      {/* نمایش کاربران آنالیز شده در صورت وجود */}
      {/* {debuggers.length > 0 && (
        <div className="mt-4 p-2 border rounded">
          <h3 className="font-bold">نتایج آنالیز:</h3>
          <pre className="text-xs">{JSON.stringify(debuggers, null, 2)}</pre>
        </div>
      )} */}

    </div>
  );
};

export default ChatWithAi;
