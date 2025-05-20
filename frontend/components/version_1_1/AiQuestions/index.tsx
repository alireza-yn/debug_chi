"use client";
import { AICategory, Main } from "@/components/types/AI-question";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Textarea,
  User,
} from "@heroui/react";
import { ArrowUp, MessageCircleCode } from "lucide-react";
import { useAnswer } from "@/context/AiContextAnswer";
import AudioPlayer from "./AudioPlayer";
import Image from "next/image";

type Props = {
  question: Main[];
};

const AiQuestion = ({ question }: Props) => {
  console.log(question);
  const [message_id, setMessageId] = useState(0);
  const {
    selectedAnswer,
    setWelcome,
    chat,
    setChat,
    setShowAnalyze,
    welcome,
    setSelectedQuestionIndex,
    setQuestion,
    showQuestion,
    setShowQuestion,
    selectedQuestionIndex,
    questions,
    setSelectedAnswer,
    setSelectedQuestion,
    addChat,
    setQuestionLength,
  } = useAnswer();
  const showMessage = (id: number) => {
    setMessageId(id);
  };

  const handleQuestion = (item: AICategory, index: number) => {
    setQuestionLength(question[index].ai_category.length);
    setQuestion((prev) => [...prev, item]);
    if (item) {
      addChat({
        id: item.id,
        is_bot: true,
        text: item.title,
        audio: item.sound != null ? item.sound : "",
      });
      setSelectedQuestion(item);
    } else {
      setShowAnalyze(true);
    }
  };

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      handleQuestion(
        question[selectedQuestionIndex].ai_category[selectedAnswer],
        selectedQuestionIndex
      );
    } else {
      didMount.current = true;
    }
  }, [selectedAnswer]);

  if (welcome) {
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
              در نهایت، مشکل برنامه نویسی شما حل شدنیه! با ما همراه باشید تا
              بدون دردسر، سریع و دقیق، مشکل شما را بررسی و حل کنیم
              <br />
              <br />
              بیایید با یک پرسش و پاسخ سریع برای پیدا کردن متخصص مناسب شروع
              کنیم.
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
                onPress={() => {
                  setShowQuestion(true);
                  setWelcome(false);
                }}
              >
                شروع
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showQuestion) {
    return (
      <div className="w-full flex flex-col gap-2 box-border p-5">
        {chat.map((item) => {
          return (
            <div
              key={item.id}
              dir={item.is_bot ? "ltr" : "rtl"}
              className={` w-full box-border px-4 items-start flex flex-col gap-2 ${
                item.is_bot ? "justify-start" : "justify-end"
              }`}
            >
              <User
                name={item.is_bot ? "bot" : "user"}
                avatarProps={{
                  src: item.is_bot ? "/ai/image/bot.jpeg" : "/user.jpg",
                }}
              />
              <div className="max-w-md flex items-center justify-center rounded-3xl bg-default-100 min-h-10 box-border px-4">
                <span key={item.id}>{item.text}</span>
              </div>
              {item.is_bot && <AudioPlayer audioSrc={item.audio} />}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="w-full flex-1 flex-col flex h-full items-center justify-center"
      dir="rtl"
    >
      {/* <MessageCircleCode className="stroke-lime-300" size={64} /> */}
      <span className="text-4xl mb-20">چطور میتونم کمکت کنم؟</span>

      <div
        className=" w-[55%] h-96 grid grid-cols-2 gap-4 mb-4 "
        id="questions"
      >
        {question.length > 0 &&
          question.map((item, index) => {
            console.log(item);
            return (
              <div
                key={index + 1}
                onClick={() => {
                  setSelectedQuestionIndex(index);
                  setWelcome(true);
                  handleQuestion(item.ai_category[0], index);
                }}
                className="flex items-center justify-center gap-4 bg-default-50 border border-default-100 max-h-96 px-4 box-border rounded-2xl cursor-pointer overflow-y-auto"
                onMouseEnter={() => showMessage(index + 1)}
                onMouseLeave={() => setMessageId(0)}
              >
                <div className="flex-1 flex gap-4 p-2 items-center">
                  <div className="w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.icon || "/user.jpg"}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="rounded-full border border-default-100 object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <h2
                      className={`font-mediumSans ${
                        message_id == index + 1
                          ? "dark:text-lime-300"
                          : "text-foreground"
                      }`}
                    >
                      {item.category_name}
                    </h2>
                    <h3 className="w-full text-tiny text-wrap font-lightSans  leading-5">
                      {item.description}
                    </h3>
                  </div>
                </div>
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    message_id === index + 1
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-lime-300"
                    onPress={() => {
                      setSelectedQuestionIndex(index);
                      setWelcome(true);
                      handleQuestion(item.ai_category[0], index);
                    }}
                    startContent={<ArrowUp color="black" />}
                  ></Button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AiQuestion;
