import { Avatar, Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RootState, useAppSelector } from "@/redux/store/store";
import { ArrowRightIcon, Check, Volume1 } from "lucide-react";
import { perform_post } from "@/lib/api";
import { AnimatedShinyText } from "@/components/ui/ace/animation-text";
import { cn } from "@/lib/utils";
import { div } from "motion/react-client";
import Cookies from "js-cookie";
import { Main } from "@/components/types/user.types";
type Props = {
  person: boolean;
  message: string;
  analyze?: boolean;
};

const Message = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const [user_data,setUserData] = useState<Main>()
  const user = Cookies.get('user_data')


  useEffect(()=>{
    if(user){
      setUserData(JSON.parse(user))
    }
  },[])



  const voiceHandler = async (text_to: string) => {
    const response = await perform_post("api/v1/text_to_speech/", {
      text: text_to,
    });

    const audioUrl = response.url;

    const newAudio = new Audio(audioUrl);
    newAudio.onended = () => {
      setIsPlaying(false);
    };
    setAudio(newAudio);

    if (isPlaying) {
      newAudio.pause();
    } else {
      newAudio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const { delay } = useAppSelector((state: RootState) => state.aiQuestion);

  // Split the message into words
  const words = props.message.split(" ");

  // Animation variants for container and words
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

  // Base word animation
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

  // Special analyze animation with left-to-right fade effect
  const analyzeContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        staggerDirection: -1, // Reverse stagger direction for RTL
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
        delay: i * 0.1, // Delay based on word index
      },
    }),
  };

  if (props.person) {
    return (
      <div className="w-full h-auto box-border p-4 flex flex-col items-end" dir="rtl">

        {delay.state && delay.message == props.message ? (
          <div className="w-full flex-1 flex justify-end">
          <div className="w-5 h-5 bg-foreground-500 rounded-full animate-pulse flex-row-reverse"></div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 items-center flex-row-reverse " >
              <Avatar
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhASaYjeDzOkzQX9Q3UCafoh61EfV3mtVkw&s"
                name="Name"
                size="sm"
              />
              <span>debugchi.io</span>
            </div>
            <div className="w-max box-border min-h-14 pr-10 rounded-bl-full flex items-center justify-end">
              {props.analyze ? (
                // Special analyze animation with left-to-right fade
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
                  {/* <div className="z-10 flex min-h-64 items-center justify-center">
                    <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                      <span>✨{props.message}</span>
                      <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    </AnimatedShinyText>
                  </div> */}
                </motion.div>
              ) : (
                // Regular animation
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
            <div>
              <Button
                isIconOnly
                startContent={<Volume1 />}
                size="sm"
                variant="light"
                onPress={() => voiceHandler(props.message)}
              ></Button>
            </div>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full box-border p-4 flex flex-col  rounded-lg" dir="rtl">
        <div className="min-w-10 flex flex-col p-4 box-border rounded-lg bg-[#2b2c42] border">

        <div className="flex gap-2 items-center">
          <Avatar
            src={user_data?.image_profile || ''}
            name={user_data?.first_name}
            size="sm"
          />
          <span>{user_data?.first_name + " " + user_data?.last_name || 'کاربر عادی'}</span>
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
          <Check size={20}/>
          {/* <div className="flex-1 "> */}

          {/* </div> */}
        </div>
        </div>
      </div>
    );
  }
};

export default Message;
