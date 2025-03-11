"use client";
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

const AiContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { question_id, selected_category, conversation } = useAppSelector(
    (state) => state.aiQuestion
  );

  useEffect(() => {
    // اگر هنوز selected_category ست نشده، بذار استارتر بشه
    if (!selected_category) {
      const foundCategory = Questions.find((q) =>
        q.category.toLowerCase().includes("starter")
      );
      if (foundCategory) {
        dispatch(setSelectedCategory(foundCategory));
        dispatch(showQuestion(0));
      }
    }
  }, [dispatch, selected_category]);

  // هر بار سوال عوض می‌شود، پاسخ‌های سفارشی را پاک کن
  useEffect(() => {
    dispatch(clearAddedAnswers());
  }, [question_id, dispatch]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  if (!selected_category) {
    return <p className="text-gray-500">سوالی برای این دسته‌بندی یافت نشد.</p>;
  }

  return (
    <div className="w-3/4 mx-auto flex-1 flex flex-col items-center p-4">
      <div className="w-full flex justify-start flex-col">
        <div className="h-[calc(100vh-300px)] overflow-y-auto" ref={scrollRef}>
          {/* پیام‌های چت نمایش داده می‌شود */}
          {conversation.map((item, index) => {
            return (
              <UserMessage
                key={index}
                person={item.ai}
                message={item.message}
                analyze={item.analyze}
                sound={item.sound}
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
