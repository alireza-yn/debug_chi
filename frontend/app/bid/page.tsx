import { Main } from "@/components/types/tender.type";
import UserProfile from "@/components/ui/Profile";
import Bid from "@/components/version_1_1/Bid";
import BidFilter from "@/components/version_1_1/Bid/BidFilter";
import BidIncomingList from "@/components/version_1_1/Bid/BidIncomingList";
import Sidebar from "@/components/version_1_1/Sidebar";
import SidebarBody from "@/components/version_1_1/Sidebar/SideBar";
import SidebarFooter from "@/components/version_1_1/Sidebar/sidebar-footer";
import TinderUserProfile from "@/components/version_1_1/User/TinderUserProfile";
import { BidFilterProvider } from "@/context/BidFilterContext";
import { perform_get, perform_post } from "@/lib/api";
import { cookies } from "next/headers";
import React from "react";

const page = async ({ params }: any) => {
   const token = (await cookies()).get("token")?.value;
  const tender: Main = await perform_get("api/v1/bids_tender_list/");

  return (
    <main className="w-full h-screen flex">
      <Sidebar>
        <SidebarBody  />
        <SidebarFooter  token={token}/>
      </Sidebar>
      <div className="flex-1 flex  h-full box-border p-5 gap-4">
        <div className="bg-foreground-100 flex flex-col rounded-3xl flex-1 w-full">
          <BidFilterProvider>

          <div className="w-full h-20 flex items-center justify-between bg-default-50 rounded-t-3xl box-border p-4">
              <BidFilter />
          </div>
          <div className="w-full box-border flex-1 overflow-y-auto px-4">
            
            <Bid data={tender} />
          </div>
          </BidFilterProvider>
        </div>
        <div className="bg-foreground-100 rounded-3xl h-full">
          <BidIncomingList />
        </div>
      </div>
    </main>
  );
};

export default page;
