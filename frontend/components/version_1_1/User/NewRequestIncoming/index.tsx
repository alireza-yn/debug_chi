"use client";
import { Button, User } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import OnlineAction from "../OnlineAction";
import { BellRing } from "lucide-react";
import { FullPendingDebug, Main, PendingConsult, PendingDebug } from "@/components/types/incomingRequest";
import Cookies from "js-cookie";
import { formatCurrency } from "@/utils/tools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { setShowNewRequest } from "@/redux/slices/globalSlice";
type Props = {};

const NewRequestIncoming = (props: Props) => {


  const router = useRouter();
    const {showNewRequest} = useAppSelector((state: RootState) => state.gloabal);
  const dispatch = useAppDispatch()
  const [pendingList, setPendingList] = useState<Main>({
    pending_consult: [],
    pending_debug: [],
  });

  useEffect(() => {
    const is_online = Cookies.get("is_online");
    if (is_online === "true") {
      dispatch(setShowNewRequest(true))
    }
    
    const fetchData = async () => {
      const token = Cookies.get("token");

      try {
        const response = await fetch(
          `${process.env.server}/api/v1/debug/get_pending_session/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setPendingList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [showNewRequest]);

  return (
    <>


      <AnimatePresence>
        {showNewRequest && (
          <motion.div
            dir="rtl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "backInOut" }}
            className="absolute bottom-0  min-h-[384px] max-h-[700px] w-[600px] h-auto bg-[#16061b] rounded-tr-2xl rounded-tl-2xl flex flex-col gap-1 items-center box-border pt-2  z-50"
          >
            <div className="flex gap-2 items-center">
              <span>درخواست ها</span>
              <BellRing size={16} />
            </div>
            <div className="w-full h-full overflow-y-auto bg-c_secondary border-t border-[#452669] flex flex-col gap-4 box-border rounded-tr-2xl rounded-tl-2xl p-4 pb-32">
              <RequestCard data={pendingList}/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewRequestIncoming;
const RequestCard = ({ data }: { data: Main }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { pending_debug, pending_consult } = data;
  const router = useRouter();

  const isDebug = (item: PendingConsult | PendingDebug): item is PendingDebug => {
    return "file" in item;
  };

  const pendingList = [...pending_debug, ...pending_consult];

  if (pendingList.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full box-border p-4 bg-c_background/50 rounded-3xl">
        <span className="flex-1 flex justify-center items-center box-border text-primary-700">
          هیچ درخواستی وجود ندارد
        </span>
      </div>
    );
  }

  return pendingList.map((item) => {
    const debugMode = isDebug(item);
    const user = debugMode ? item.debuger_applicator : item.consult_applicator;
    const tag = debugMode ? "# دیباگ" : "# مشاوره";

    const handleAccept = async () => {
      setLoadingId(item.session_id);
      // simulate any async operation if needed
      await router.push(`/chat/${item.session_id}`);
    };

    return (
      <div key={item.session_id} className="flex flex-col gap-2 w-full box-border p-4 bg-c_background/50 rounded-3xl">
        <div className="flex items-center gap-2">
          <User
            avatarProps={{
              src: user.image_profile != null ? `${process.env.server}/${user.image_profile}` : '/user.jpg',
            }}
            description={user.username}
            name={user.first_name + " " + user.last_name}
          />
          <span className="flex-1 flex items-center justify-end">
            {formatCurrency(item.price)}
          </span>
        </div>
        <span className="flex-1 flex justify-start items-center box-border text-primary-700">
          {tag}
        </span>

        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <h2 className="text-2xl">{item.title}</h2>
            <p className="font-lightSans text-foreground-500 text-justify">
              {item.description}
            </p>
          </div>
          <div className="flex items-end justify-end box-border gap-2">
            <Button
              color="success"
              isLoading={loadingId === item.session_id}
              onPress={handleAccept}
            >
              {loadingId === item.session_id ? 'درحال برقراری ارتباط' : 'پذیرش'}
            </Button>
          </div>
        </div>
      </div>
    );
  });
};
