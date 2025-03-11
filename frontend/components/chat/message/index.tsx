import { Avatar, Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RootState, useAppSelector } from "@/redux/store/store";
import { ArrowRightIcon, Check, Volume1, VolumeX } from "lucide-react";
import Cookies from "js-cookie";
import { Main } from "@/components/types/user.types";

type Props = {
  person: boolean;
  message: string;
  analyze?: boolean;
  sound?: string;
};

const Message = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [user_data, setUserData] = useState<Main>();
  const user = Cookies.get("user_data");

  useEffect(() => {
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  // آماده سازی صدا در useEffect
  useEffect(() => {
    if (props.sound) {
      const newAudio = new Audio(props.sound);
      newAudio.onended = () => {
        setIsPlaying(false);
      };
      setAudio(newAudio);
    }
  }, [props.sound]);

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        // پخش صدا با تأخیر ۲ ثانیه‌ای
        setTimeout(() => {
          audio.play();
          setIsPlaying(true);
        }, 2000);
      }
    }
  };

  const { delay } = useAppSelector((state: RootState) => state.aiQuestion);

  const words = props.message.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const analyzeContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const analyzeWordAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
  };

  if (props.person) {
    return (
      <div
        className="w-full h-auto box-border p-4 flex flex-col items-end"
        dir="rtl"
      >
        {delay.state && delay.message === props.message ? (
          <div className="w-full flex-1 flex justify-end">
            <div className="w-5 h-5 bg-foreground-500 rounded-full animate-pulse flex-row-reverse"></div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 items-center flex-row-reverse">
              <Avatar
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhASaYjeDzOkzQX9Q3UCafoh61EfV3mtVkw&s"
                name="Name"
                size="sm"
              />
              <span>debugchi.io</span>
            </div>
            <div className="w-max box-border min-h-14 pr-10 rounded-bl-full flex items-center justify-end">
              {props.analyze ? (
                <motion.div
                  className="flex flex-wrap gap-x-1 justify-end"
                  variants={analyzeContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      variants={wordAnimation}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-wrap gap-x-1 justify-end"
                  variants={container}
                  initial="hidden"
                  animate="visible"
                >
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      variants={wordAnimation}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>
            {props.sound && (
              <div>
                <Button
                  isIconOnly
                  startContent={isPlaying ? <VolumeX /> : <Volume1 />}
                  size="sm"
                  variant="light"
                  onPress={togglePlayPause}
                ></Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full box-border p-4 flex flex-col rounded-lg" dir="rtl">
        <div className="min-w-10 flex flex-col p-4 box-border rounded-lg bg-[#2b2c42] border">
          <div className="flex gap-2 items-center">
            <Avatar
              src={user_data?.image_profile || ""}
              name={user_data?.first_name}
              size="sm"
            />
            <span>
              {user_data?.first_name + " " + user_data?.last_name ||
                "کاربر عادی"}
            </span>
          </div>
          <div className="w-max box-border min-h-14 pr-10 rounded-bl-full flex gap-4 items-center">
            <motion.div
              className="flex flex-wrap gap-x-1 justify-end"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordAnimation}
                  className="inline-block text-foreground-500"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            <Check size={20} />
          </div>
        </div>
      </div>
    );
  }
};

export default Message;
