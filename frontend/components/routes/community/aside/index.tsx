"use client";
import ChatList from "@/components/chat/chatList.tsx";
import { Main } from "@/components/types/user.types";
import UserProfile from "@/components/user/Profile";
import { OpenSideBar } from "@/redux/slices/globalSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

type Props = {
  user:Main;
};

const CommunityAside = (props: Props) => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const open = useAppSelector((state: RootState) => state.gloabal.side);
  const dispatch = useAppDispatch();
  // const [open,setOpen] = useState<boolean>(true)
  console.log(mode);
  const openSideBar = () => {
    dispatch(OpenSideBar(!open));
  };
  return (
    <aside
      className={`${
        open ? "w-96 bg-[#120f20] h-full  box-border px-4" : "w-0 opacity-0 "
      } duration-500 transition-all ease-in-out`}
    >
      {mode == "chat" && <ChatList />}
      {mode == "ai" && <div>Ai</div>}

      {mode == "profile" && <UserProfile user={props.user} />}
    </aside>
  );
};

export default CommunityAside;
