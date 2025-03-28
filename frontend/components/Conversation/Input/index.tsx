"use client";
import { Button, Input, Textarea, Tooltip } from "@heroui/react";
import {
  ArrowUp,
  Code2,
  Mic2,
  Paperclip,
  Pin,
  Volume2,
  VolumeOff,
} from "lucide-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { setConversation } from "@/redux/slices/chatWithUser";
import { AnyDeskIcon, MicIcon } from "@/components/ui/icons";
import {socket} from "@/config/socket-config";
import { Main } from "@/components/types/user.types";
import Cookies from "js-cookie";
import { setMessage  } from "@/redux/slices/chatSocketSlice";
import { v4 as uuidv4, v4} from "uuid"
import SendCode from "@/components/chat/code";
import { setShowRequest } from "@/redux/slices/globalSlice";
type Props = {
  reciever:string
};

const InputMessage = ({reciever}: Props) => {
  const path = usePathname();
  const [description, SetDescription] = useState<string>("");
  const dispatch = useAppDispatch();
  const {payed} = useAppSelector((state:RootState)=>state.gloabal)
  let user: any;
  const user_data = localStorage.getItem("user_data");
  if (user_data) {
    user = JSON.parse(user_data);
  }
  
  const sendMessage = () => {
    if(!payed){
      dispatch(setShowRequest(true))
    }else{

      const data = {
        id:v4(),
        sender: user.uuid,
        receiver: reciever,
        data: {
          type:"text",
          text: description,
          created_at: String(new Date()),
          status:"pending",
        }
      }
      
      dispatch(setMessage(data))
      socket.emit("test_message", data );
      SetDescription("");
    }
  };
  return (
    <div className="flex flex-col w-[90%] rounded-xl mx-auto box-border border dark:border-none">
      <Textarea
        value={description}
        onValueChange={(value) => {
          SetDescription(value);
        }}
        variant="bordered"
        className="w-full"
        classNames={{
          input:
            "dark:bg-[#232035] bg-white border-none outline-none rounded-bl-none",
          innerWrapper:
            "dark:bg-[#232035] bg-white border-none outline-none rounded-bl-none",
          inputWrapper:
            "dark:bg-[#232035] bg-white border-none outline-none rounded-bl-none rounded-br-none",
        }}
        minRows={1}
        maxRows={5}
        labelPlacement="inside"
        placeholder="بنویسید..."
      />
      <div className="flex p-2 box-border  dark:bg-[#232035] bg-white  rounded-b-xl">
        {description.length > 0 ? (
          <Button
            className="bg-lime-300 text-black"
            startContent={<ArrowUp />}
            isIconOnly
            onPress={sendMessage}
            radius="full"
          ></Button>
        ) : (
          <Button
            className="bg-lime-300 text-black"
            startContent={<MicIcon />}
            isIconOnly
            radius="full"
          ></Button>
        )}

        <div className="flex-1 flex items-center justify-end gap-4">
          <Tooltip color="primary" content="کد">
      
            <SendCode  sender={user.uuid } reciever={reciever}/>
          </Tooltip>

          <Tooltip color="primary" content="ارسال فایل">
            <Button
              isIconOnly
              variant="light"
              color="primary"
              radius="full"
              startContent={<Paperclip />}
            ></Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default InputMessage;
