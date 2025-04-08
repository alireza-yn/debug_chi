// import Header from "@/components/Layout/Header";
// import Tabs from "@/components/Layout/Tabs";
// import ClassInfo from "@/components/routes/home/ClassInfo";
// import Hero from "@/components/routes/home/Hero";
// import LiveUsers from "@/components/routes/home/LiveDebugers";
// import MainSLider from "@/components/routes/home/MainSlider";
// import NavCard from "@/components/routes/home/NavCard";
// import Services from "@/components/routes/home/Services";
// import Slider from "@/components/routes/home/Slider";
// import ChatSpcket from "@/components/Socket/ChatSpcket";
// import SockectTest from "@/components/Socket/SockectTest";
// import { LinearGradiant } from "@/components/Tools/LinearGradiant";
// import { ThreeDCardDemo } from "@/components/ui/ace/Test";
// import { Sidebar, SidebarBody } from "@/components/version_1_1/Sidebar";
// import { SideBar } from "@/components/version_1_1/Sidebar/SideBar";
import ChatWithAi from "@/components/chat/send_ai";
import AIBotProfile from "@/components/ui/Profile/aibotprofile";
import Sidebar from "@/components/version_1_1/Sidebar";
import SidebarBody from "@/components/version_1_1/Sidebar/SideBar";
import SidebarFooter from "@/components/version_1_1/Sidebar/sidebar-footer";
import AiContent from "@/components/chat/content_ai";
import * as React from "react";
import AiWelcome from "@/components/chat/content_ai/Welcom";
import Answers from "@/components/chat/content_ai/Answers";
import SendDescription from "@/components/chat/content_ai/SendDescription";
import FindUser from "@/components/version_1_1/FindUser";
import { cookies } from "next/headers";
import { perform_get } from "@/lib/api";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Power, Settings, Star } from "lucide-react";
import {
  DebugerHome,
  DebugerRequest,
} from "@/components/version_1_1/User/home";
import clientPromise from "@/lib/mongodb";
import NewRequestIncoming from "@/components/version_1_1/User/NewRequestIncoming";
import OnlineAction from "@/components/version_1_1/User/OnlineAction";
// import { service } from "@/components/routes/home/Services/data";
// import { LogoIcon } from "@/components/ui/icons";
// import { Chip } from "@heroui/react";
// import { data } from "@/components/routes/home/ClassInfo/data";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;
  const client = await clientPromise;
  const db = client.db("debugchi_front");
  const faq = await db.collection("faq").find().toArray();

  const serializedFaq = faq.map((item) => ({
    ...item,
    _id: item._id.toString(), // ✅ Convert ObjectId to string
  }));

  if (token) {
    const response = await perform_get("auths/user_info/", token);
    if (response.user_roles.includes("debugger")) {
      return (
        <main className="w-full h-screen flex">
          <Sidebar>
            <SidebarBody />
            <SidebarFooter />
          </Sidebar>
          <div className="flex flex-1 box-border gap-4 p-4" dir="rtl">
            <div className="flex flex-col w-96 h-full rounded-2xl bg-c_background/50">
              <DebugerRequest />
            </div>
            <div className="flex-1 flex flex-col h-full bg-c_background/50 rounded-2xl">
              <section className="flex-1">
                <DebugerHome user={response} faq={serializedFaq} />
              </section>
              <section className="h-32 flex items-center justify-center relative">
                <OnlineAction />
                <NewRequestIncoming />
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
        <SidebarFooter />
      </Sidebar>
      <div className="flex-1 flex  h-full box-border p-4 gap-4">
        <div className="bg-gray-100 dark:bg-c_background/50  rounded-3xl h-full w-96">
          <AIBotProfile />
        </div>
        <div className="relative bg-gray-100 dark:bg-c_background/50  flex flex-col rounded-3xl h-full w-full">
          <FindUser />

          <div className="flex-1 w-full">
            <AiWelcome />
          </div>
          <div className="w-full h-40 ">
            <Answers />
          </div>
          <div className="w-full h-auto box-border p-5">
            <ChatWithAi />
            <SendDescription />
          </div>
        </div>
      </div>
    </main>
  );
}
