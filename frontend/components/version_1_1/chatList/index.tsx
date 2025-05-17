"use client";
import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { perform_get } from "@/lib/api";
import { Spinner } from "@heroui/react";
import {
  Main,
  OpenedDebug,
  OpenedConsult,
} from "@/components/types/debuger_chat_list";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserCard } from "./user-card";
import { useRequestFilter } from "@/context/RequetsFilterProvider";
import { deepSearch } from "@/utils/tools";

type Props = {};

const ChatList = (props: Props) => {
  const [chatList, setChatList] = useState<Main>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<any>();
  const path = usePathname();
  const session_id = path.split("/")[2];
  const { filter } = useRequestFilter();
  const currentPath = usePathname()


  const is_main = currentPath === '/'

  const userHandler = (user: any) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await perform_get(
        `api/v1/debug/open_debug_session/`,
        token
      );
      if (response) setChatList(response);
      setLoading(false);
    };
    fetchChats();
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


  const allChats = useMemo(() => {
    if (!chatList) return [];
    return [...chatList.opened_consult, ...chatList.opened_debug];
  }, [chatList]);

  // ✅ Apply filter
  const filteredChats = useMemo(() => {
    if (!filter) return allChats;
    return allChats.filter((chat) => deepSearch(chat, filter));
  }, [allChats, filter]);

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

  const defaultSession = filteredChats[0]?.session_id || null;

  return (
    <div className="flex flex-col gap-4 box-border p-4 flex-1  overflow-y-auto">
      {selectedUser && !is_main &&(
        <UserCard
          user={selectedUser}
          data={data}
          defaultSession={defaultSession || ""}
        />
      )}
      
      {filteredChats.length > 0 &&  
        filteredChats.map((chat) => {
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
        
      {filteredChats.length === 0 && (
        <p className="text-center text-foreground-500">موردی یافت نشد</p>
      )}
    </div>
  );
};

export default ChatList;

// ✅ ChatCard component (تغییری نکرده)
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
  const isDebug = "debuger" in chat;
  const user = isDebug ? chat.debuger_applicator : chat.consult_applicator;
  const startAt = isDebug ? chat.start_at : chat.close_at;
  const description = chat.description;

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
          src={user.image_profile || "/user.jpg"}
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
