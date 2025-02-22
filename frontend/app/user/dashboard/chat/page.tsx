// "use client";
import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import ProfileMenu from "@/components/Layout/ProfileMenu";

import UserList from "@/components/routes/user/dashboard/chats/UserList";
import ChatArea from "@/components/routes/user/dashboard/chats/ChatArea";
import { cookies } from "next/headers";
import Notifications from "@/components/Layout/Notifications";




const page = async  () => {
    const cookie = await cookies();
    const uuid = cookie.get('uuid')
    console.log(uuid)
    if (!uuid) {
        if (typeof window !== "undefined") {
          // Redirect on the client side
          window.location.href = "/";
        }
        return null; // Prevent rendering during server-side
      }
  return (
    <SidebarProvider>
      <AppSidebar side="right" collapsible="icon"/>
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b z-50 w-full bg-white">
          <div className="flex items-center gap-2 px-3 ">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                   داشبورد
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block rotate-180" />
                <BreadcrumbItem>
                  <BreadcrumbPage>پیام رسان</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex-1 flex justify-end items-center box-border px-4 gap-4">
            <Notifications />
            <ProfileMenu />
          </div>
        </div>

        <main className="flex">
          <UserList uuid={uuid.value}/>
          <ChatArea uuid={uuid.value}/>
        {/* <ChatPage data={fetchData} user_id={user_id.user_id}/> */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}


export default page