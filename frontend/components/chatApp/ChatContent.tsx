"use client";
import { Button } from "@heroui/react";
import React from "react";
import { MessageCircleCode, PanelLeft, PanelLeftClose, PanelLeftOpen, PanelsLeftRight } from "lucide-react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { OpenSideBar } from "@/redux/slices/globalSlice";
import SendMessageButton from "./send-button";
import RequestModal from "../Modal/RequestModal";
import MoreRequest from "../Modal/RequestModal/MoreRequest";

type Props = {};

const questions = [
  {
    id: 1,
    title: "مشکل در بخش سرور برای nginx",
    desription: "شسیشییشسیشسی",
  },
  {
    id: 2,
    title: "مشکل در بخش سرور برای nginx",
    desription: "شسیشییشسیشسی",
  },
  {
    id: 3,
    title: "مشکل در بخش سرور برای nginx",
    desription: "شسیشییشسیشسی",
  },
  {
    id: 4,
    title: "مشکل در بخش سرور برای nginx",
    desription: "شسیشییشسیشسی",
  },
];

const sendMessage = () => {};

const ChatContent = (props: Props) => {
  const [message_id, setMessageId] = React.useState(0);

    const open = useAppSelector((state:RootState)=>state.gloabal.side)
    const dispatch = useAppDispatch()
  const showMessage = (id: number) => {
    setMessageId(id);
  };

  return (
    <div className="flex-1 flex flex-col items-center relative">
      <Button isIconOnly className="absolute right-2 top-2" variant="light" onPress={()=>{
        dispatch(OpenSideBar(!open))
      }} startContent={open ? <PanelLeftOpen color="gray"/> :<PanelLeftClose color="gray"/> }></Button>
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-4">
        
        <MessageCircleCode className="stroke-lime-300" size={64}/>
        {/* <h1 className="text-4xl text-lime-300">پیام مدرسی یا دیباگر</h1> */}
        <span className="text-4xl mb-20">چطور میتونم کمکت کنم؟</span>

      </div>

      <div
        className=" w-[56%] min-h-[150px] grid grid-cols-2 gap-4 mb-4"
        id="questions"
      >
        {questions.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center justify-center gap-4 bg-[#232035] px-4 box-border rounded-md"
              onMouseEnter={() => showMessage(item.id)}
              onMouseLeave={() => setMessageId(0)}
            >
              <div className="flex-1 flex flex-col">
                <h2 className={`font-mediumSans ${message_id == item.id ? 'text-lime-300' : ''}`}>{item.title}</h2>
                <p className="text-foreground-500">{item.desription}</p>
              </div>
              <div
                className={`transition-all duration-500 ease-in-out ${
                  message_id === item.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <SendMessageButton disabled={false} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatContent;
