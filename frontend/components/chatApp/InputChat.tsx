"use client";
import { Button, Input, Textarea } from "@heroui/react";
import { ArrowUp, Paperclip, Pin } from "lucide-react";
import React from "react";
import PaperClip from "./PaperClip";
import SendMessageButton from "./send-button";
import { usePathname } from "next/navigation";

type Props = {};

const InputChat = (props: Props) => {
  const path = usePathname();
  console.log(path);
  const check_path = `${path}?mode=ai` === "/community/chat/ai?mode=ai";
  console.log(check_path);

  return (
    <div
      className={`h-32 w-full flex items-start justify-center ${
        check_path ? "opacity-50" : ""
      }`}
    >
      <Textarea
        disabled={check_path}
        minRows={2}
        maxRows={3}
        className="max-w-4xl "
        classNames={{
          inputWrapper:
            "h-14 py-2 bg-[#232035] border-none flex item-center justify-center",
        }}
        size="lg"
        radius="md"
        variant="faded"
        color="default"
        endContent={<PaperClip disabled={check_path} />}
        startContent={<SendMessageButton disabled={check_path} />}
      />
    </div>
  );
};

export default InputChat;
