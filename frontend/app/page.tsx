
import AIBotProfile from "@/components/ui/Profile/aibotprofile";
import Sidebar from "@/components/version_1_1/Sidebar";
import SidebarBody from "@/components/version_1_1/Sidebar/SideBar";
import SidebarFooter from "@/components/version_1_1/Sidebar/sidebar-footer";
import * as React from "react";
import FindUser from "@/components/version_1_1/FindUser";
import { cookies } from "next/headers";
import { perform_get } from "@/lib/api";
import {
  DebugerHome,
  DebugerRequest,
} from "@/components/version_1_1/User/home";
import clientPromise from "@/lib/mongodb";
import { RequestFilterProvider } from "@/context/RequetsFilterProvider";
import AiQuestion from "@/components/version_1_1/AiQuestions";
import Answers from "@/components/version_1_1/AiQuestions/Answers";
import { AnswerProvider } from "@/context/AiContextAnswer";
import BackgroundGlobalGradient from "@/components/version_1_1/ui/backgorund-gradiant-global";


export default async function Home() {

  const token = (await cookies()).get("token")?.value;
  const client = await clientPromise;
  const db = client.db("debugchi_front");
  const faq = await db.collection("faq").find().toArray();

  const serializedFaq = faq.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  const questions = await perform_get('questions/list/')

  if (token) {
    const response = await perform_get("auths/user_info/", token);
    if (response.user_roles.includes("debugger")) {
      return (
        <main className="w-full h-screen flex">
          <Sidebar>
            <SidebarBody />
            <SidebarFooter token={token} />
          </Sidebar>
          <div className="flex flex-1 box-border gap-4 p-4" dir="rtl">
            <div className="flex flex-col w-96 h-full rounded-2xl bg-c_background/50">
              <RequestFilterProvider>
                <DebugerRequest />
              </RequestFilterProvider>
            </div>
            <div className="flex-1 flex flex-col h-full bg-c_background/50 rounded-2xl">
              <section className="flex-1">
                <DebugerHome user={response} faq={serializedFaq} />
              </section>
            </div>
          </div>
        </main>
      );
    }
  }

  return (
    <main className="w-full h-screen flex">
      <Sidebar>
        <SidebarBody />
        <SidebarFooter token={token} />
      </Sidebar>
      <BackgroundGlobalGradient>

      <div className="flex-1 flex  h-screen box-border p-4 gap-4">
        {/* <div className="bg-gray-100 dark:bg-c_background/50  rounded-3xl h-full w-96">
          <AIBotProfile />
        </div> */}
        <div className="relative flex flex-col h-full w-full">
          <FindUser />
          <AnswerProvider  >
          <div className="flex-1 w-full">
            <AiQuestion question={questions}/>
          </div>
          <div className="w-full h-auto py-4">
            <Answers />
          </div>
          </AnswerProvider>
          {/* <div className="w-full h-auto box-border p-5">
            <ChatWithAi />
            <SendDescription />
          </div> */}
        </div>
      </div>
      </BackgroundGlobalGradient>

    </main>
  );
}
