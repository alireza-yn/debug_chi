"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Questions } from "@/data/AIQuestion";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import {
  showQuestion,
  setSelectedCategory,
  clearAddedAnswers,
} from "@/redux/slices/aiSlice";
import { motion } from "framer-motion";
import UserMessage from "../message";

type AnswerProps = {
  id: number;
  answer: string;
};

type QuestionCategory = {
  category: string;
  questions: {
    id: number;
    question: string;
    answers: AnswerProps[];
  }[];
};

// ✅ رنگ‌ها به ترتیب

const AiContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const query = searchParams.get("mode");

  const {
    question_id,
    selected_answers,
    selected_category,
    answer_colors,
    debuggers,
    is_last_question,
    conversation,
    addedAnswers,
    delay,
  } = useAppSelector((state) => state.aiQuestion);
  useEffect(() => {
    const foundCategory: QuestionCategory | undefined = Questions.find((q) =>
      q.category.toLowerCase().includes("starter")
    );
    console.log(selected_category);
    if (foundCategory) {
      dispatch(setSelectedCategory(foundCategory));
      dispatch(showQuestion(0));
    }
  }, [dispatch]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    dispatch(clearAddedAnswers());
  }, [question_id, dispatch]);

  if (!selected_category) {
    return <p className="text-gray-500">سوالی برای این دسته‌بندی یافت نشد.</p>;
  }

  return (
    <div className="w-3/4 mx-auto flex-1 flex flex-col items-center p-4">
      <div className="w-full flex justify-start flex-col ">
        <div className="h-[calc(100vh-300px)] overflow-y-auto" ref={scrollRef}>
          {conversation.map((item, index) => {
            return (
              <UserMessage
                key={index}
                person={item.ai}
                message={item.message}
                analyze={item.analyze}
              />
            );
          })}
        </div>
      </div>

      <motion.div
        key={question_id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6"></div>
      </motion.div>
    </div>
  );
};

export default React.memo(AiContent);
