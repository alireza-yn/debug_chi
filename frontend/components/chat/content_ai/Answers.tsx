"use client";
import {
  addAnswer,
  addCustomAnswer,
  setAnswerColors,
  setContinue,
  toggleAnswer,
} from "@/redux/slices/aiSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Plus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

type Props = {};
type AnswerProps = {
  id: number;
  answer: string;
};

const colorOptions = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "default",
] as const;

const Answers = (props: Props) => {
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
  } = useAppSelector((state: RootState) => state.aiQuestion);

  const [newAnswer, setNewAnswer] = useState<string>("");

  const dispatch = useAppDispatch();

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

  const handlePress = useCallback(
    (id: number, answer: string) => {
      dispatch(toggleAnswer(id));
      dispatch(addAnswer(answer));
      dispatch(setContinue(false));
    },
    [dispatch]
  );

  const handleAddAnswer = () => {
    if (!newAnswer.trim()) return;

    const newAnswerObj: AnswerProps = { id: Date.now(), answer: newAnswer };
    dispatch(addCustomAnswer(newAnswerObj));
    dispatch(addAnswer(newAnswerObj.answer));
    setNewAnswer("");
  };
  return (
    <div>
      {selected_category && !is_last_question && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="button_list">
          {debuggers.length > 0
            ? null
            : [
                ...selected_category.questions[question_id].answers,
                ...addedAnswers,
              ].map((answer: AnswerProps, index: number) => {
                let answerColor =
                  answer_colors[answer.id] ||
                  colorOptions[index % colorOptions.length];

                return (
                  <Button
                    key={answer.id}
                    variant={
                      selected_answers.includes(answer.id) ? "solid" : "faded"
                    }
                    color={
                      selected_answers.includes(answer.id)
                        ? "success"
                        : answerColor
                    }
                    className="w-full h-12"
                    onPress={() => handlePress(answer.id, answer.answer)}
                  >
                    {answer.answer}
                  </Button>
                );
              })}

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
                      // endContent={<CheckCircle />}

                      size="md"
                      onPress={handleAddAnswer}
                    >
                      تایید
                    </Button>
                  }
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default Answers;
