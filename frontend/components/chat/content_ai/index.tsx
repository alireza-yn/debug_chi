"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Questions } from "@/data/AIQuestion";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import {
  showQuestion,
  toggleAnswer,
  setSelectedCategory,
  setAnswerColors,
  addAnswer,
  setContinue,
} from "@/redux/slices/aiSlice";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import AiMesage from "./AiMesage";
import { Plus } from "lucide-react";

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
const colorOptions = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "default",
] as const;

const AiContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const path = usePathname();
  console.log(path);
  const query = searchParams.get("mode");

  console.log(query);

  const {
    question_id,
    selected_answers,
    selected_category,
    answer_colors,
    debuggers,
  } = useAppSelector((state) => state.aiQuestion);

  useEffect(() => {
    const foundCategory: QuestionCategory | undefined = Questions.find((q) =>
      q.category.toLowerCase().includes(query?.toLowerCase() || "")
    );
    if (foundCategory) {
      dispatch(setSelectedCategory(foundCategory));
      dispatch(showQuestion(0));
    }
  }, [query, dispatch]);

  useEffect(() => {
    if (selected_category) {
      let newColors: {
        [key: number]:
          | "primary"
          | "secondary"
          | "success"
          | "danger"
          | "warning"
          | "default";
      } = {};

      selected_category.questions[question_id].answers.forEach(
        (answer: AnswerProps, index: number) => {
          newColors[answer.id] = colorOptions[index % colorOptions.length]; // ✅ تخصیص رنگ به ترتیب
        }
      );

      dispatch(setAnswerColors(newColors));
    }
  }, [question_id, selected_category, dispatch]);

  if (!selected_category) {
    return <p className="text-gray-500">سوالی برای این دسته‌بندی یافت نشد.</p>;
  }


  const isLastQuestion =
  selected_category && question_id === selected_category.questions.length - 1;


  return (
    <div className="w-3/4  mx-auto h-full flex flex-col items-center  p-4">
      {/* <h2 className="text-xl font-bold mb-4">{selected_category.category}</h2> */}
      <AiMesage
        message={selected_category.questions[question_id].question}
        audio=""
      />
      <div className="flex-1"></div>

      <motion.div
        key={question_id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debuggers.length > 0
              ? null
              : selected_category.questions[question_id].answers.map(
                  (answer: AnswerProps, index: number) => {
                    let answerColor =
                      answer_colors[answer.id] ||
                      colorOptions[index % colorOptions.length];
                    return (
                      <Button
                        key={answer.id}
                        variant={
                          selected_answers.includes(answer.id)
                            ? "solid"
                            : "faded"
                        }
                        color={
                          selected_answers.includes(answer.id)
                            ? "success"
                            : answerColor
                        } // ✅ رنگ ثابت بعد از انتخاب
                        className="w-full h-12"
                        onPress={() => {
                          dispatch(toggleAnswer(answer.id));
                          dispatch(addAnswer(answer.answer));
                          dispatch(setContinue(false))
                        }}
                      >
                        {answer.answer}
                      </Button>
                    );
                  }
                )}
                
            <Button  variant="faded" color="success" endContent={<Plus />}  className="w-full h-12">
              افزودن
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiContent;
