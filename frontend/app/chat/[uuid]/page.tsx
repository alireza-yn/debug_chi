import Action from "@/components/chat/header/action";
import InputChat from "@/components/chatApp/InputChat";
import Conversation from "@/components/Conversation";
import InputMessage from "@/components/Conversation/Input";
import RequestModal from "@/components/Modal/RequestModal";
import MoreRequest from "@/components/Modal/RequestModal/MoreRequest";
import { Main } from "@/components/types/user.types";
import UserProfile from "@/components/ui/Profile";
import ChatList from "@/components/version_1_1/chatList";
import UserNormalChatList from "@/components/version_1_1/chatList/noramal-user-chatlist";
import Sidebar from "@/components/version_1_1/Sidebar";
import SidebarBody from "@/components/version_1_1/Sidebar/SideBar";
import SidebarFooter from "@/components/version_1_1/Sidebar/sidebar-footer";
import { RequestFilterProvider } from "@/context/RequetsFilterProvider";
import { perform_get } from "@/lib/api";
import { Button } from "@heroui/react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: any) => {

  const token = (await cookies()).get("token")?.value;
  const { uuid } = await params;
  const response = await perform_get(
    `api/v1/debug/get-session-info/${uuid}`,
    token
  );

  console.log(response);

  if (!token) {
    return <div>not found</div>;
  }

  return (
    <main className="w-full h-screen flex">
      <Sidebar>
        <SidebarBody />
        <SidebarFooter token={token} />
      </Sidebar>
      <div className="flex-1 flex  h-full box-border p-5 gap-4">
        <div className="bg-foreground-100 rounded-3xl h-full overflow-y-auto w-96">
          <RequestFilterProvider>
            {response.is_debuger ? <ChatList /> : <UserNormalChatList />}
          </RequestFilterProvider>
        </div>
        <div className="bg-foreground-100 flex flex-col rounded-3xl flex-1 w-full relative">
          <RequestModal />
          <MoreRequest />
          <div className="flex items-center gap-4 absolute left-0 top-0 w-full rounded-2xl h-20 box-border px-5 bg-foreground-50 z-50">
            <Action
              reciever={
                response.data.debuger_applicator ||
                response.data.consult_applicator
              }
            />
          </div>
          <div className=" w-full box-border p-5  flex-1 relative overflow-y-auto py-28">
            <Conversation
              is_commented={response.is_commneted}
              is_closed={response.data.status}
              user={response.data.debuger || response.data.consult}
              user_applicator={
                response.data.debuger_applicator ||
                response.data.consult_applicator
              }
              session_id={response.data.session_id}
            />
          </div>
          <div
            className="w-full h-auto box-border pb-1 absolute bottom-0 z-20 bg-foreground-100"
            dir="rtl"
          >
            {response.is_debuger ? (
              <InputMessage
                data={response}
                reciever={
                  response.data.debuger_applicator ||
                  response.data.consult_applicator
                }
              />
            ) : (
              <InputMessage
                data={response}
                reciever={response.data.debuger || response.data.consult}
              />
            )}
            {/*             
            {response.is_debuger ? (
              <InputMessage
                reciever={
                  response.data.debuger_applicator ||
                  response.data.consult_applicator
                }
              />
            ) : response.data.is_locked  ? (
              <div className="w-full flex justify-center items-center bg-foreground-100 rounded-3xl h-16">
                <p className="text-sm text-foreground-200">
                  در حال بررسی درخواست شما هستیم
                </p>
              </div>
            ) : (
              <>
                {response.data.is_locked == false && (
                  <InputMessage
                    reciever={response.data.debuger || response.data.consult}
                  />
                )}
              </>
            )} */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
