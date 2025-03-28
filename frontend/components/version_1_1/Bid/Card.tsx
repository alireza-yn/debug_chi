"use client";
import { useAppDispatch } from "@/redux/store/store";
import {
  addToast,
  Button,
  Chip,
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

type Props = {
  tender: Tender;
  bids: Bid[];
};

const Card = ({ tender, bids }: Props) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const token = Cookies.get("token");
  const user_data = localStorage.getItem("user_data");
  let user: any;
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
      dispatch(showLogin({show:true,path:pathname}));
    } else if (action == "submit") {
      // Handle bid submission
      const response = await perform_post("/api/v1/submit_bid/", {
        tender: tender_id,
        amount: price,
      });
      console.log(response);
      if (response.success) {
        console.log(user);
        const newBid: Bid = {
          user: user || "",
          id: Date.now(), // برای نمایش سریع در UI، بعداً ID واقعی از سرور دریافت می‌شود
          amount: price,
          created_at: new Date(),
          updated_at: new Date(),
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
      console.log(response);
      if (response.success) {
        setBidsList((prevBids) => {
          return prevBids.map((item) =>
            item.user.uuid === user.uuid ? { ...item, amount: price, updated_at: new Date() } : item
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
        amount: msg.amount,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
      };
      setBidsList((prevBids) => [...prevBids, newBid]);
    });
  }, [socket]);

  const calculateTimeRemaining = () => {
    const now = new Date();
    const endTime = new Date(tender.end_time);
    const timeRemaining = endTime.getTime() - now.getTime();

    if (timeRemaining <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { days, hours, minutes };
  };

  const timeRemaining = calculateTimeRemaining();

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
    <div className="w-full h-[700px] bg-foreground-50 rounded-2xl mt-4 flex flex-col">
      <div className="w-full h-20 bg-[#f5f5f5] dark:bg-[#242424] rounded-t-2xl flex items-center justify-between box-border px-4">
        <User
          name={`${tender.created_by.first_name} ${tender.created_by.last_name}`}
          avatarProps={{
            src: `${process.env.server}/${tender.created_by.image_profile}`,
          }}
        />
        <div className="flex items-center gap-1 justify-center w-auto px-4 h-full">
          <div className="flex flex-col gap-1 items-center">
            <Button
              size="sm"
              variant="flat"
              color="danger"
              className="w-10 h-10"
            >
              {timeRemaining.days}
            </Button>
            <span>روز</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Button
              size="sm"
              variant="flat"
              color="danger"
              className="w-10 h-10"
            >
              {timeRemaining.hours}
            </Button>
            <span>ساعت</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Button
              size="sm"
              variant="flat"
              color="danger"
              className="w-10 h-10"
            >
              {timeRemaining.minutes}
            </Button>
            <span>دقیقه</span>
          </div>
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              isIconOnly
              size="sm"
              startContent={<Ellipsis />}
            ></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
            ></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="flex-1 rounded-b-2xl flex">
        {/* Left side - Bids list */}
        <div
          className="w-96 flex flex-col border-r-1 border-stone-200 dark:border-stone-800"
          dir="rtl"
        >
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
          <div
            className="h-20 border-t-1 border-stone-800 flex flex-col items-center justify-center gap-2 box-border px-20 w-full"
            dir="ltr"
          >
            <div className="flex  items-center justify-between gap-4  w-full">
              <Chip variant="flat" color="success" dir="rtl">
                {formatCurrency(Number(bid))}
              </Chip>
              <span>بالاترین قیمت</span>
            </div>
            <div className="border border-t-1 border-dashed border-stone-700 w-full"></div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {tender.image && (
            <div className="mb-4">
              <img
                src={`${process.env.server}/${tender.image}`}
                alt={tender.title}
                className="max-w-full rounded-lg h-[200px] object-cover w-full"
              />
            </div>
          )}

          <div className="flex flex-col gap-4" dir="rtl">
            <h2 className="text-xl font-bold mb-4">{tender.title}</h2>

            <div className="mt-4">
              <div className="p-3  rounded-lg">
                <h2>{tender.description}</h2>
              </div>
            </div>

            {tender.file && (
              <div className="mt-4 w-1/4">
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Download size={18} />}
                  as="a"
                  href={`${process.env.server}${tender.file}`}
                  target="_blank"
                  className="w-full"
                >
                  بررسی سرفصل
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-20 bg-[#f5f5f5] dark:bg-[#242424] rounded-b-2xl flex items-center justify-between box-border px-4 ">
        {user_exist ? (
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
                size="lg"
                className="bg-purple-700 "
                startContent={<Coins />}
                onPress={() => submitBid("update", tender.id, Number(value))}
              >
                افزایش مزایده
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
                        submitBid(
                          "update",
                          tender.id,
                          Number(bid) * 1.2
                        )
                      }
                    >
                      {formatCurrency(Number(bid) * 1.2)}
                    </Button>
                    <Button
                      onPress={() =>
                        submitBid(
                          "update",
                          tender.id,
                          Number(bid) * 1.5
                        )
                      }
                    >
                      { formatCurrency(Number(bid) * 1.5) }
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        ) : (
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
                size="lg"
                className="bg-purple-700 "
                startContent={<Coins />}
              >
                شرکت در مزایده
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
                    <Input
                      color="success"
                      ref={value}
                      min={0}
                      placeholder="قیمت خود را وارد نمایید"
                      type="number"
                      defaultValue={`${tender.highest_bid}`}
                      endContent={
                        <Button
                          color="success"
                          size="sm"
                          onPress={() =>
                            submitBid("submit", tender.id, Number(value))
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
                        submitBid(
                          "submit",
                          tender.id,
                          Number.parseFloat(tender.start_bid) * 1.2
                        )
                      }
                    >
                      {Number.parseFloat(tender.start_bid) * 1.2}
                    </Button>
                    <Button
                      onPress={() =>
                        submitBid(
                          "submit",
                          tender.id,
                          Number.parseFloat(tender.start_bid) * 1.5
                        )
                      }
                    >
                      {Number.parseFloat(tender.start_bid) * 1.5}
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}

        <Action />
      </div>
    </div>
  );
};

export default Card;
