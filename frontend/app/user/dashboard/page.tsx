import Dashboard from "@/components/routes/user/dashboard/Dashboard";
import { headers, performRequest } from "@/lib/api";
import axios from "axios";
import React from "react";
import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
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
import Notifications from "@/components/Layout/Notifications";

type Props = {};

const dashboard = async () => {


  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let fetchData = null;
  let user: any;
  if (token) {
    user = jwtDecode(token);
    try {
      const response = await axios.get(
        `${process.env.server}/auths/user_info/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData = response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar side="right"/>
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b z-50 w-full bg-white">
          <div className="flex items-center gap-2 px-3 ">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-1 justify-end px-4 gap-4">
            <Notifications />
            <ProfileMenu />
          </div>
        </div>

        <main className='flex flex-1 flex-col gap-4 p-4"relative'>
          <section className="w-full absolute top-16 ">
            <Dashboard
              user={fetchData}
              is_me={user.user_id === fetchData.id ? true : false}
            />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default dashboard;
