import { Main } from "@/components/types/tender.type";
import UserProfile from "@/components/ui/Profile";
import Bid from "@/components/version_1_1/Bid";
import Sidebar from "@/components/version_1_1/Sidebar";
import SidebarBody from "@/components/version_1_1/Sidebar/SideBar";
import SidebarFooter from "@/components/version_1_1/Sidebar/sidebar-footer";
import TinderUserProfile from "@/components/version_1_1/User/TinderUserProfile";
import { perform_get, perform_post } from "@/lib/api";
import React from "react";

const page = async  ({ params }: any) => {


const tender:Main  = await perform_get('api/v1/bids_tender_list/')

console.log(tender)


  return (
    <main className="w-full h-screen flex">
      <Sidebar>
        <SidebarBody />
        <SidebarFooter />
      </Sidebar>
      <div className="flex-1 flex  h-full box-border p-5 gap-4">
        <div className="bg-foreground-100 rounded-3xl h-full w-96">
          <TinderUserProfile user={tender.results[0].tender.created_by} />
        </div>
        <div className="bg-foreground-100 flex flex-col rounded-3xl flex-1 w-full">
          <div className="w-full box-border flex-1 overflow-y-auto px-4">
            <Bid data={tender} />
          </div>
        
        </div>
      </div>
    </main>
  );
};

export default page;
