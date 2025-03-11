import AiWelcome from "@/components/chat/content_ai/Welcom";
import ChatWithAi from "@/components/chat/send_ai";
import ChatContent from "@/components/chatApp/ChatContent";
import InputChat from "@/components/chatApp/InputChat";
import RequestModal from "@/components/Modal/RequestModal";
import MoreRequest from "@/components/Modal/RequestModal/MoreRequest";
import CommunityAside from "@/components/routes/community/aside";
import { perform_get } from "@/lib/api";
import { useSearchParams } from "next/navigation"; // برای کلاینت کامپوننت‌ها
import React from "react";

const Page = async ({
  params,
  searchParams,
}: {
  params: { c: string };
  searchParams: { mode?: string; hide?: string };
}) => {
  const { c } = params;
  const { mode, hide } = searchParams || {}; // در صورت عدم وجود مقدار، مقدار `undefined` خواهد بود
  console.log(mode, hide);

  const response = await perform_get(
    `api/v1/user-info/${"6e6b2721-0bdd-42d3-803b-2db033cac0ac"}/`
  );

  console.log(response);
  console.log(c);

  return (
    <main className="main flex h-screen">
      <CommunityAside url={c} user={response} />
      <section className="w-full h-full flex flex-col bg-[#1b1829] relative">
        {c === "ai" && <AiWelcome />}

        {mode === "profile" && <ChatContent />}
        {c === "ai" ? <ChatWithAi /> : <InputChat />}

        <RequestModal />
        <MoreRequest />
      </section>
    </main>
  );
};

export default Page;
