import ChatList from "@/components/chat/chatList.tsx";
import MainChat from "@/components/chat/main";
import ChatSidebar from "@/components/chat/side";
import React from "react";

const page = () => {
  return (
    <main className="flex p-5 box-border h-screen mx-auto">
      <div className="w-40 bg-[#181818] box-border px-1 rounded-md mx-2">
        <ChatSidebar />
      </div>
      <div className="min-w-[500px] bg-[#282828] p-4 box-border rounded-r-lg">
        <ChatList />
      </div>
      <MainChat mode="ai" />
    </main>
  );
};

export default page;
