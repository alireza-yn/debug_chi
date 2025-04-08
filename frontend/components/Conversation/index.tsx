"use client";
import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { socket } from "@/config/socket-config";
import { usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Main, Main as MainUser } from "../types/user.types";
import { Main as MainChat } from "../types/testChat.type";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import {
  setData,
  setMessage,
  setRead,
  setSatus,
} from "@/redux/slices/chatSocketSlice";
import Action from "../chat/header/action";

type Props = {
  user: Main;
  session_id: string;
};

const Conversation = ({ user,session_id }: Props) => {
  let sender: MainUser;
  const query = useSearchParams();
  const chat = useAppSelector((state: RootState) => state.chatSocket);
  const dispatch = useAppDispatch();
  const path = usePathname();
  const uuidFromPath = path?.split("/")[2];

  const session = query.get("session");
  const user_data = localStorage.getItem("user_data");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);  // ref برای انتهای پیام‌ها

  if (user_data) {
    sender = JSON.parse(user_data);
  }
useEffect(()=>{
  const data = {
    session_id: session_id,
  };
  console.log(data);
  socket.emit("get_messages", data);
  socket.on("get_messages", (data) => {
    console.log(data);
    dispatch(setData(data));
  });

},[1])
  useEffect(() => {
  

    socket.on(String(sender.uuid), (msg) => {
      dispatch(setMessage(msg));
    });

    socket.on(`${sender.uuid}_sent`, (id) => {
      dispatch(setSatus({ id: id, status: "sent" }));
    });

    socket.on(`${uuidFromPath}_${sender.uuid}_read`, (data) => {
      console.log(data);
      if (data.read) {
        dispatch(setRead());
      }
    });

    // اسکرول به انتهای پیام‌ها هر زمان که پیام جدید می‌آید
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });

    return () => {
      socket.off(String(sender.uuid));
    };
  }, [socket, chat]); // وابسته به chat است تا هنگام تغییر پیام‌ها اسکرول به پایین انجام شود

  return (
    <div className="w-full flex flex-col gap-2 pt-20 flex-1 overflow-y-auto">
      {chat.map((item: MainChat,index) => {
        return (
          <div key={index} dir={item.sender == sender.uuid ? "rtl" : ""}>
            <Message
              data={item.data}
              sender={item.sender}
              reciever={user.image_profile}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} /> {/* اینجا رفرنس را به انتهای لیست پیام‌ها اضافه می‌کنیم */}
    </div>
  );
};

export default Conversation;
