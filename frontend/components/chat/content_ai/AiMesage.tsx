import { Avatar } from "@heroui/react";
import React from "react";
import { motion } from "framer-motion";

type Props = {
  message: string;
  audio: string | "";
};

const AiMessage = (props: Props) => {
  // Split the message into words
  const words = props.message.split(" ");

  // Animation variants for container and words
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="w-full h-auto box-border p-4 flex flex-col" dir="rtl">
      <div className="flex gap-2 items-center">
        <Avatar
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhASaYjeDzOkzQX9Q3UCafoh61EfV3mtVkw&s"
          name="Name"
          size="sm"
        />
        <span>debugchi.io</span>
      </div>
      <div
        className="w-max box-border min-h-14 pr-10 rounded-bl-full 
        flex items-center"
      >
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
              className={"inline-block"}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AiMessage;
