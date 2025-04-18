"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { perform_get } from "@/lib/api";
import { I18nProvider, useDateFormatter } from "@react-aria/i18n";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { Main as User } from "@/components/types/user.types";
import {
  Main,
  OpenedDebug,
  OpenedConsult,
} from "@/components/types/debuger_chat_list";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { set } from "date-fns";
import { setUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Cross,
  GaugeCircle,
  MessageCircleCode,
  Mic,
  Phone,
  PhoneCall,
  ShieldAlert,
  Video,
} from "lucide-react";
import {
  CalendarDate,
  getLocalTimeZone,
  now,
  Time,
  today,
} from "@internationalized/date";
import { formatCurrency } from "@/utils/tools";
import { boolean } from "zod";
import { UserCard } from "./user-card";
type Props = {};

const ChatList = (props: Props) => {
  const [chatList, setChatList] = React.useState<Main>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any>();
  const [selectedUser, setSelectedUser] = React.useState<any>();
  const path = usePathname();
  const session_id = path.split("/")[2];

  const userHandler = (user: any) => {
    setSelectedUser(user);
  };

  const chats = [
    ...(chatList?.opened_consult || []),
    ...(chatList?.opened_debug || []),
  ];

  useEffect(() => {
    setLoading(true);

    const token = Cookies.get("token");
    const getChatList = async () => {
      const response = await perform_get(
        `api/v1/debug/open_debug_session/`,
        token
      );
      if (response) {
        setChatList(response);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    getChatList();
  }, []);

  useEffect(() => {
    if (!session_id || !chatList) return;

    const findAndSetUser = () => {
      const consult = chatList.opened_consult.find(
        (c) => c.session_id === session_id
      );
      const debug = chatList.opened_debug.find(
        (d) => d.session_id === session_id
      );

      const user = debug?.debuger_applicator || consult?.consult_applicator;
      if (user) {
        setSelectedUser(user);
        setData(debug || consult);
      }
    };

    findAndSetUser();
  }, [chatList, session_id]);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        <Spinner
          classNames={{ label: "text-foreground mt-4" }}
          label="spinner"
          variant="spinner"
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 box-border p-4 flex-1  overflow-y-auto">
      {/* {session_id} */}
      {selectedUser && <UserCard user={selectedUser} data={data} />}
      {chats.length > 0 &&
        chats.map((chat) => {
          const isSelected = chat.session_id === session_id;
          return (
            <ChatCard
              chat={chat}
              key={chat.id}
              isSelected={isSelected}
              setUser={userHandler}
              setData={setData}
            />
          );
        })}
    </div>
  );
};

export default ChatList;



const ChatCard = ({
  chat,
  isSelected,
  setUser,
  setData,
}: {
  chat: OpenedDebug | OpenedConsult;
  isSelected: boolean;
  setUser: (user: any) => void;
  setData: (chat: any) => void;
}) => {
  const isDebug = "debuger" in chat; // چون فقط OpenedDebug این پراپرتی رو داره
  const user = isDebug ? chat.debuger_applicator : chat.consult_applicator;
  const startAt = isDebug ? chat.start_at : chat.close_at;
  const description = isDebug ? chat.description : chat.description;
  const image = user.image_profile;
  const router = useRouter();
  return (
    <div
      onClick={() => {
        setUser(user);
        setData(chat);
        router.push(`/chat/${chat.session_id}`);
      }}
      className={`flex items-center justify-between ${
        isSelected
          ? "bg-black cursor-pointer"
          : "bg-default/80 hover:bg-default cursor-pointer"
      } rounded-3xl h-16 px-5`}
    >
      <div className="flex items-center gap-4">
        <Image
          src={image != null ? `${process.env.server}/${image}` : "/user.jpg"}
          width={40}
          height={40}
          alt={user.first_name + " " + user.last_name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p className="text-sm text-foreground">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-xs text-foreground-500">
            {description.substring(0, 50)}...
          </p>
        </div>
      </div>
      <p className="text-sm text-foreground">
        {new Date(startAt).toLocaleString("fa-IR")}
      </p>
    </div>
  );
};
