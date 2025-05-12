import Sidebar from "@/components/version_1_1/Sidebar";
import SidebarBody from "@/components/version_1_1/Sidebar/SideBar";
import SidebarFooter from "@/components/version_1_1/Sidebar/sidebar-footer";
import UserSerivices from "@/components/version_1_1/UserService";
import { Divider } from "@heroui/react";
import { cookies } from "next/headers";
import React from "react";

type Props = {};

const page = async () => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  return (
    <main className="w-full h-screen flex">
      <Sidebar>
        <SidebarBody />
        <SidebarFooter token={token} />
      </Sidebar>
      <div className="flex-1 flex h-full box-border p-4">
        <div className="flex-1 h-full bg-default-50 box-border p-4 overflow-y-auto scrollbar-hide">
          <UserSerivices />
        </div>
        <Divider orientation="vertical"/>
        <div className="w-96 bg-default-50 h-full">

        </div>

      </div>
    </main>
  );
};

export default page;
