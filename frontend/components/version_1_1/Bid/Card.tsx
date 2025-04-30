"use client";
import { useAppDispatch } from "@/redux/store/store";
import {
  addToast,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  NumberInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@heroui/react";
import {
  Check,
  CheckCircle,
  Coins,
  Download,
  Ellipsis,
  Plus,
} from "lucide-react";
import Cookies from "js-cookie";
import { showLogin } from "@/redux/slices/globalSlice";
import Action from "./action";
import type { Bid, Tender } from "@/components/types/tender.type";
import Link from "next/link";
import { formatCurrency } from "@/utils/tools";
import { useEffect, useRef, useState } from "react";
import { socket, trend_socket } from "@/config/socket-config";
import { perform_post, perform_update } from "@/lib/api";
import { response } from "express";
import { Main } from "@/components/types/user.types";
import { usePathname } from "next/navigation";
import EventCard from "./EventCard";
import { useBidFilter } from "@/context/BidFilterContext";

type Props = {
  tender: Tender;
  bids: Bid[];
};

const Card = ({ tender, bids }: Props) => {
  const { filter, priceValue } = useBidFilter();

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const token = Cookies.get("token");
  const user_data = localStorage.getItem("user_data");
  let user: any;
  const is_tender = tender.mode == "tender" ? true : false;

  if (user_data) {
    user = JSON.parse(user_data || "");
  }
  const value = useRef<HTMLInputElement | null>(null);
  const [bidsList, setBidsList] = useState<Bid[]>(bids);
  const submitBid = async (
    action: "submit" | "update",
    tender_id: number,
    price: number
  ) => {
    if (!token) {
      setIsOpen(false);
      dispatch(showLogin({ show: true, path: pathname }));
    } else if (action == "submit") {
      // Handle bid submission
      const response = await perform_post("api/v1/submit_bid/", {
        tender: tender_id,
        amount: price.toString(),
      });

      if (response.success) {
        const newBid: Bid = {
          user: user || "",
          id: Date.now(), // برای نمایش سریع در UI، بعداً ID واقعی از سرور دریافت می‌شود
          amount: price.toString(),
          created_at: new Date(),
          updated_at: new Date(),
          tender: 0,
        };
        addToast({
          title: "درخواست شما ثبت شد",
          description: response.message,
          color: "success",
        });
        // اضافه کردن پیشنهاد جدید به لیست
        setBidsList((prevBids) => [...prevBids, newBid]);
      }

      if (response.status == 400) {
        addToast({
          title: "درخواست شما ثبت نشد",
          description: response.data.message,
          color: "danger",
        });
      }
    } else if (action == "update") {
      const response = await perform_update("api/v1/submit_bid/", {
        tender: tender_id,
        amount: price,
      });

      if (response.success) {
        setBidsList((prevBids) => {
          return prevBids.map((item) =>
            item.user.uuid === user.uuid
              ? { ...item, amount: price.toString(), updated_at: new Date() }
              : item
          );
        });
        addToast({
          title: "درخواست شما بروزرسانی شد",
          description: response.message,
          color: "success",
        });
        // اضافه کردن پیشنهاد جدید به لیست
      }
    }

    console.log(bidsList);
  };

  let user_exist: any;
  if (user) {
    user_exist = bids.find((item) => item.user.uuid == user.uuid);
  }
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Calculate remaining time
  useEffect(() => {
    console.log("Updated bidsList:", bidsList);
  }, [bidsList]);
  useEffect(() => {
    socket.on("", (msg) => {
      const newBid: Bid = {
        user: msg.user,
        id: msg.id, // برای نمایش سریع در UI، بعداً ID واقعی از سرور دریافت می‌شود
        amount: msg.amount.toString(),
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        tender: 0,
      };
      setBidsList((prevBids) => [...prevBids, newBid]);
    });
  }, [socket]);

 
  // Find highest bid
  const highestBid =
    bids.length > 0
      ? bids.reduce(
          (max, bid) => (bid.amount > max.amount ? bid : max),
          bids[0]
        )
      : null;
  const bid = highestBid ? highestBid.amount : tender.start_bid;
  return (
    <div className="w-full h-[700px] bg-foreground-50 rounded-2xl mt-4 box-border flex flex-col">
      <div className="w-full h-20 bg-[#f5f5f5] dark:bg-[#242424] rounded-t-2xl flex items-center justify-between box-border px-4">
        <User
          name={`${tender.created_by.first_name} ${tender.created_by.last_name}`}
          avatarProps={{
            src: `${tender.created_by.image_profile}`,
          }}
        />
        <TenderTimer time={tender.end_time} />

        <div className="flex items-center gap-2">
        
          <Chip>{is_tender ? "مزایده" : "مناقصه"}</Chip>
        </div>
      </div>
      <div className="flex-1 flex box-border px-5 bg-[#f5f5f5] dark:bg-[#242424] ">
        <div className="w-96 flex flex-col bg-main_bg/40 rounded-l-2xl" dir="rtl">
          <div className="flex-1 flex flex-col p-4">
            <div className="mb-4">
              <Chip variant="flat" color="success">
                پیشنهاد دهندگان
              </Chip>
              <div className="max-h-[400px] overflow-y-auto">
                {bidsList.length > 0 ? (
                  bidsList
                    .map((bid) => (
                      <div
                        key={bid.id}
                        className="flex justify-between flex-row-reverse items-center p-3 b my-2 hover:bg-foreground-100 rounded-lg transition-all duration-500 ease-in-out"
                      >
                        <h3 className="text-foreground-300">
                          {bid.user.username ||
                            `${bid.user.first_name} ${bid.user.last_name}`}
                        </h3>

                        <Chip variant="flat" color="danger">
                          {formatCurrency(Number(bid.amount))}
                        </Chip>
                      </div>
                    ))
                    .reverse()
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    هنوز پیشنهادی ثبت نشده است
                  </div>
                )}
              </div>
            </div>
          </div>
          <Divider className="w-3/4 mx-auto bg-c_background" />
          <div className="h-20  border-stone-800 flex flex-col items-center justify-center gap-2 box-border px-20 w-full ">
            <div className="flex  items-center justify-between gap-4 w-full">
              {is_tender ? (
                <>
                  <Chip variant="flat" color="success" dir="rtl">
                    {formatCurrency(Number(bid))}
                  </Chip>
                  <span>بالاترین قیمت</span>
                </>
              ) : (
                <>
                  <Chip variant="flat" color="success" dir="rtl">
                    {formatCurrency(Number(bid))}
                  </Chip>
                  <span>ورودی</span>
                </>
              )}
            </div>
            <div className="border border-t-1 border-dashed border-stone-700 w-full"></div>
          </div>
        </div>

        <Divider orientation="vertical" className="bg-c_background" />

        <div className="flex-1 p-4 flex flex-col overflow-hidden bg-main_bg/40 rounded-r-2xl  ">
          {tender.image && (
            <div className="mb-4">
              <img
                src={`${tender.image}`}
                alt={tender.title}
                className="rounded-lg object-cover w-full h-[200px]"
              />
            </div>
          )}

          <div
            className="flex flex-col gap-4 z-10  w-full mx-auto   box-border  flex-1 relative"
            dir="rtl"
          >
            <h2 className="text-xl font-blackSans mb-4">{tender.title}</h2>

            <div className="mt-4">
              <div className=" rounded-lg">
                <h2 className="font-lightSans leading-7">{tender.description}</h2>
              </div>
            </div>

            {/* {tender.project && ( */}
            <div className="mt-4 w-1/4">
              {tender.project != null && <EventCard data={tender.project} />}
            </div>
            {/* )} */}
          </div>
        </div>
      </div>

      <div className="w-full h-20 bg-[#f5f5f5] dark:bg-[#242424] rounded-b-2xl flex items-center justify-between box-border px-4 ">
        {is_tender ? (
          <Popover
            showArrow
            offset={10}
            placement="bottom"
            onOpenChange={(open) => setIsOpen(open)}
            isOpen={isOpen}
          >
            <PopoverTrigger>
              <Button
                color="secondary"
                size="sm"
                className="bg-purple-700 "
                startContent={<Coins />}
                onPress={() => submitBid("update", tender.id, Number(value))}
              >
                {user_exist ? "بروزرسانی پیشنهاد" : "شرکت در مزایده"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {(titleProps) => (
                <div className="px-1 py-2 w-full">
                  <p
                    className="text-small font-bold text-foreground"
                    {...titleProps}
                  ></p>
                  <div className="mt-2 flex flex-col gap-2 w-full">
                    <NumberInput
                      isRequired
                      color="success"
                      ref={value}
                      min={0}
                      label="قیمت"
                      errorMessage="قیمت را وارد نمایید"
                      placeholder="قیمت خود را وارد نمایید"
                      type="number"
                      defaultValue={Number(bid)}
                      endContent={
                        <Button
                          color="success"
                          size="sm"
                          onPress={() =>
                            submitBid("update", tender.id, Number(value))
                          }
                        >
                          تایید
                        </Button>
                      }
                      size="lg"
                      variant="faded"
                    />
                    <Button
                      onPress={() =>
                        submitBid("update", tender.id, Number(bid) * 1.2)
                      }
                    >
                      {formatCurrency(Number(bid) * 1.2)}
                    </Button>
                    <Button
                      onPress={() =>
                        submitBid("update", tender.id, Number(bid) * 1.5)
                      }
                    >
                      {formatCurrency(Number(bid) * 1.5)}
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        ) : (
          <ActionBid
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            submitBid={submitBid}
            tender={tender}
            value={value}
            user_exist={user_exist}
          />
          // <Popover
          //   showArrow
          //   offset={10}
          //   placement="bottom"
          //   onOpenChange={(open) => setIsOpen(open)}
          //   isOpen={isOpen}
          // >
          //   <PopoverTrigger>
          //     <Button
          //       variant="solid"
          //       color="secondary"
          //       size="lg"
          //       className="bg-purple-700 "
          //       startContent={<Coins />}
          //     >
          //       شرکت در مزایده
          //     </Button>
          //   </PopoverTrigger>
          //   <PopoverContent className="w-auto">
          //     {(titleProps) => (
          //       <div className="px-1 py-2 w-full">
          //         <p
          //           className="text-small font-bold text-foreground"
          //           {...titleProps}
          //         ></p>
          //         <div className="mt-2 flex flex-col gap-2 w-full">
          //           <Input
          //             color="success"
          //             ref={value}
          //             min={0}
          //             placeholder="قیمت خود را وارد نمایید"
          //             type="number"
          //             defaultValue={`${tender.highest_bid}`}
          //             endContent={
          //               <Button
          //                 color="success"
          //                 size="sm"
          //                 onPress={() =>
          //                   submitBid("submit", tender.id, Number(value))
          //                 }
          //               >
          //                 تایید
          //               </Button>
          //             }
          //             size="lg"
          //             variant="faded"
          //           />
          //           <Button
          //             onPress={() =>
          //               submitBid("submit", tender.id, tender.start_bid * 1.2)
          //             }
          //           >
          //             {tender.start_bid * 1.2}
          //           </Button>
          //           <Button
          //             onPress={() =>
          //               submitBid("submit", tender.id, tender.start_bid * 1.5)
          //             }
          //           >
          //             {tender.start_bid * 1.5}
          //           </Button>
          //         </div>
          //       </div>
          //     )}
          //   </PopoverContent>
          // </Popover>
        )}

        <Action tender_uuid={tender.uuid} comment_id={tender.uuid} is_like={tender.tender_like} like_count={tender.tender_like_count} />
      </div>
    </div>
  );
};

export default Card;

const ActionBid = ({
  isOpen,
  setIsOpen,
  value,
  tender,
  submitBid,
  user_exist,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value: React.RefObject<HTMLInputElement>;
  tender: Tender;
  user_exist: any;
  submitBid: (
    action: "submit" | "update",
    tender_id: number,
    price: number
  ) => void;
}) => {
  if (user_exist) {
    return (
      <Popover
        showArrow
        offset={10}
        placement="bottom"
        onOpenChange={(open) => setIsOpen(open)}
        isOpen={isOpen}
      >
        <PopoverTrigger>
          <Button
            variant="solid"
            color="secondary"
            size="sm"
            className="bg-purple-700 "
            startContent={<Coins />}
          >
            {user_exist ? "بروزرسانی پیشنهاد" : "شرکت با قیمت کمتر"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          {(titleProps) => (
            <div className="px-1 py-2 w-full">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              ></p>
              <div className="mt-2 flex flex-col gap-2 w-full">
                <NumberInput
                  color="success"
                  ref={value}
                  min={0}
                  placeholder="قیمت خود را وارد نمایید"
                  defaultValue={tender.start_bid}
                  endContent={
                    <Button
                      color="success"
                      size="sm"
                      onPress={() =>
                        submitBid(
                          user_exist ? "update" : "submit",
                          tender.id,
                          Number(value)
                        )
                      }
                    >
                      تایید
                    </Button>
                  }
                  size="lg"
                  variant="faded"
                />
                {/* <Button
                  onPress={() =>
                    submitBid(
                      user_exist ? "update" : "submit",
                      tender.id,
                      tender.start_bid * 1.2
                    )
                  }
                >
                  {tender.start_bid * 1.2}
                </Button>
                <Button
                  onPress={() =>
                    submitBid(
                      user_exist ? "update" : "submit",
                      tender.id,
                      tender.start_bid * 1.5
                    )
                  }
                >
                  {tender.start_bid * 1.5}
                </Button> */}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <div className="flex gap-4">
      <Button
        variant="solid"
        color="secondary"
        size="sm"
        className="bg-purple-700 ml-3"
        startContent={<Coins />}
        onPress={() => submitBid("submit", tender.id, Number(tender.start_bid))}
      >
        {"شرکت در مناقصه"}
      </Button>
    {/* <span className="w-4"></span> */}
      <Popover
        showArrow
        offset={10}
        placement="bottom"
        onOpenChange={(open) => setIsOpen(open)}
        isOpen={isOpen}
      >
        <PopoverTrigger>
          <Button
            variant="solid"
            color="secondary"
            size="sm"
            className="bg-purple-700"
            startContent={<Coins />}
          >
            شرکت با قیمت کمتر
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          {(titleProps) => (
            <div className="px-1 py-2 w-full">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              ></p>
              <div className="mt-2 flex flex-col gap-2 w-full">
                <NumberInput
                  color="success"
                  ref={value}
                  min={0}
                  placeholder="قیمت خود را وارد نمایید"
                  defaultValue={tender.start_bid}
                  // defaultValue={`${tender.start_bid}`}
                  endContent={
                    <Button
                      color="success"
                      size="sm"
                      onPress={() =>
                        submitBid(
                          user_exist ? "update" : "submit",
                          tender.id,
                          Number(value)
                        )
                      }
                    >
                      تایید
                    </Button>
                  }
                  size="sm"
                  variant="faded"
                />
                {/* <Button
                onPress={() =>
                  submitBid(
                    user_exist ? "update" : "submit",
                    tender.id,
                    tender.start_bid * 1.2
                  )
                }
              >
                {tender.start_bid * 1.2}
              </Button>
              <Button
                onPress={() =>
                  submitBid(
                    user_exist ? "update" : "submit",
                    tender.id,
                    tender.start_bid * 1.5
                  )
                }
              >
                {tender.start_bid * 1.5}
              </Button> */}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};



const TenderTimer = ({ time }: { time: any }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const endTime = new Date(time)
      const timeRemaining = endTime.getTime() - now.getTime()

      if (timeRemaining <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    // Update time immediately
    setTimeRemaining(calculateTimeRemaining())

    // Set up interval to update every second
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [time])

  const hasTimeEnded =
    timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0





  return (
    <div className="flex items-center gap-1 justify-center w-auto px-4 h-full">
      <div className="flex flex-col gap-1 items-center">
        <Button size="sm" variant="flat" color={hasTimeEnded ? "danger" : "success"} className="w-10 h-10 !text-white">
          {timeRemaining.days}
        </Button>
        <span>روز</span>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <Button size="sm" variant="flat" color={hasTimeEnded ? "danger" : "success"} className="w-10 h-10 !text-white">

          {timeRemaining.hours}
        </Button>
        <span>ساعت</span>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <Button size="sm" variant="flat" color={hasTimeEnded ? "danger" : "success"} className="w-10 h-10 !text-white">

          {timeRemaining.minutes}
        </Button>
        <span>دقیقه</span>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <Button size="sm" variant="flat" color={hasTimeEnded ? "danger" : "success"} className="w-10 h-10 !text-white">

          {timeRemaining.seconds}
        </Button>
        <span>ثانیه</span>
      </div>
    </div>
  )
}

