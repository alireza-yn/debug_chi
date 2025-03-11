"use client";
import React, { useCallback, useState, useEffect } from "react";
import {
  addAnswer,
  addCustomAnswer,
  setAnswerColors,
  setContinue,
  toggleAnswer,
  showQuestion,
  setSelectedCategory,
} from "@/redux/slices/aiSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { Questions } from "@/data/AIQuestion";
import Cookies from "js-cookie";

// رنگ‌هایی که برای دکمه‌ها اختصاص می‌دهید
const colorOptions = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "default",
] as const;

type AnswerProps = {
  id: number;
  answer: string;
  description?: string;
};

function getCategoryByFirstAnswer(answer: string) {
  switch (answer) {
    case "توسعه وب":
      return "Web Development";
    case "اپلیکیشن های موبایل":
      return "Mobile App";
    case "داد های هوش مصنوعی":
      return "AI Data";
    case "بازی سازی":
      return "Game Development";
    case "بلاکچین وب 3":
      return "Blockchain, Web 3";
    default:
      return null;
  }
}

const Answers: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    question_id,
    selected_answers,
    selected_category,
    answer_colors,
    debuggers,
    is_last_question,
    addedAnswers,
  } = useAppSelector((state: RootState) => state.aiQuestion);

  const [newAnswer, setNewAnswer] = useState<string>("");

  useEffect(() => {
    const checkStarted = Cookies.get("started");
    if (checkStarted === "true") {
      const filterMode: any = Questions.find(
        (item) => item.category === "starter"
      );
      dispatch(setSelectedCategory(filterMode));
    }
  }, []);

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
      const currentQuestion = selected_category.questions[question_id];
      if (currentQuestion) {
        currentQuestion.answers.forEach(
          (answer: AnswerProps, index: number) => {
            newColors[answer.id] = colorOptions[index % colorOptions.length];
          }
        );
      }
      dispatch(setAnswerColors(newColors));
    }
  }, [question_id, selected_category, dispatch]);

  const handlePress = useCallback(
    (id: number, answer: string) => {
      dispatch(toggleAnswer(id));
      dispatch(addAnswer(answer));
      dispatch(setContinue(false));

      if (
        selected_category?.category.toLowerCase() === "starter" &&
        question_id === 0
      ) {
        const newCat = getCategoryByFirstAnswer(answer);
        if (newCat) {
          const foundCategory = Questions.find((q) => q.category === newCat);
          if (foundCategory) {
            dispatch(setSelectedCategory(foundCategory));
            dispatch(showQuestion(0));
          }
        }
      }
    },
    [dispatch, selected_category, question_id]
  );

  const handleAddCustomAnswer = () => {
    if (!newAnswer.trim()) return;
    const newAnswerObj: AnswerProps = { id: Date.now(), answer: newAnswer };
    dispatch(addCustomAnswer(newAnswerObj));
    dispatch(addAnswer(newAnswerObj.answer));
    setNewAnswer("");
  };

  const currentQuestion = selected_category?.questions?.[question_id];
  const questionAnswers = currentQuestion?.answers || [];

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (Cookies.get("started") === "true") {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, []);
  
  if (hidden) return null;

  if (!currentQuestion || is_last_question) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="button_list">
        {debuggers.length > 0
          ? null
          : [...questionAnswers, ...addedAnswers].map(
              (answer: AnswerProps, index: number) => {
                const answerColor =
                  answer_colors[answer.id] ||
                  colorOptions[index % colorOptions.length];
                const isSelected = selected_answers.includes(answer.id);

                return (
                  <Tooltip
                    key={answer.id}
                    color={answer.description ? "warning" : "default"}
                    content={
                      answer.description ? (
                        <div className="px-1 py-2 w-44 h-auto text-right">
                          <div className="text-md font-lightSans">
                            {answer.description}
                          </div>
                        </div>
                      ) : null
                    }
                  >
                    <Button
                      variant={isSelected ? "solid" : "faded"}
                      color={isSelected ? "success" : answerColor}
                      className="w-full h-12"
                      onPress={() => handlePress(answer.id, answer.answer)}
                    >
                      {answer.answer}
                    </Button>
                  </Tooltip>
                );
              }
            )}

        <Popover placement="top-end">
          <PopoverTrigger>
            <Button
              variant="faded"
              color="success"
              endContent={<Plus />}
              className="w-full h-12"
            >
              افزودن
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <Input
                type="text"
                label="کلید واژه"
                maxLength={30}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                endContent={
                  <Button
                    variant="flat"
                    color="success"
                    size="md"
                    onPress={handleAddCustomAnswer}
                  >
                    تایید
                  </Button>
                }
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Answers;
