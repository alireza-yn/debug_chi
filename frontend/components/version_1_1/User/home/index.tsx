"use client";
import { Main } from "@/components/types/user.types";
import {
  Accordion,
  AccordionItem,
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import axios from "axios";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  File,
  Headset,
  History,
  MoveDownLeft,
  Search,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import { GetUserActivityHistoryTab } from "../TabsData";
import RequetsList from "./RequetsList";
import ChatList from "../../chatList";
import OnlineAction from "../OnlineAction";
import NewRequestIncoming from "../NewRequestIncoming";
import { useRequestFilter } from "@/context/RequetsFilterProvider";
import ClassActivities from "./ClassActivity";
import TicketsTracking from "./TicketsTracking";

type Props = {
  user: Main;
  faq: any;
};

export const DebugerHome = ({ user, faq }: Props) => {
  return (
    <div className="flex flex-wrap flex-col gap-4 w-full h-full">
      <Tabs
        aria-label="Tabs variants"
        variant="underlined"
        className="bg-foreground-50 rounded-tr-3xl rounded-tl-3xl h-20 flex items-center justify-start box-border p-5"
      >
        <Tab
          key="home"
          title={
            <div className="flex gap-2 items-center">
              <Headset size={18} />
              <span>بخش اصلی</span>
            </div>
          }
        >
          <div className="w-full h-full relative">
            <div className="h-[600px] box-border p-5 overflow-y-auto "></div>
            <section className="h-32 flex items-center justify-center relative">
              <OnlineAction />
              <NewRequestIncoming />
            </section>
          </div>
        </Tab>
        <Tab
          key="activities"
          title={
            <div className="flex gap-2 items-center">
              <Activity />
              <span>کلاس ها</span>
            </div>
          }
        >
          <div className="w-full h-full relative box-border p-5">
            <ClassActivities />
          </div>
        </Tab>
        <Tab
          key="support"
          title={
            <div className="flex gap-2 items-center">
              <Headset size={18} />
              <span>پشتیبانی</span>
            </div>
          }
        >
          <div className="w-full h-full ">
            <div className="h-[600px] box-border p-5 overflow-y-auto gap-3 flex flex-col relative">
              <Chip variant="faded">پرتکرارترین ها</Chip>
              <SupportFAQ data={faq} user={user} />
              <TicketsTracking phone={user.user_phone}/>
            </div>
          </div>
        </Tab>
        <Tab
          key="History"
          title={
            <div className="flex gap-2 items-center">
              <History size={18} />
              <span>تاریخچه</span>
            </div>
          }
        >
          <div className="w-full h-full ">
            <div className="h-[750px] box-border overflow-y-auto p-5">
              <GetUserActivityHistoryTab />
            </div>
          </div>
        </Tab>
        <Tab
          key="Rate"
          title={
            <div className="flex gap-2 items-center">
              <Sparkles size={18} />
              <span>رتبه</span>
            </div>
          }
        >
          <div className="w-full h-full">
            <RankTab user={user} />

          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

const FilterDropDown = () => {
  const [selectedKey, setSelectedKey] = React.useState("همه");
  const { filter, setFilter } = useRequestFilter();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize" variant="bordered">
          {selectedKey}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        closeOnSelect={true}
        selectedKeys={new Set([selectedKey])}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          const key: any = Array.from(keys)[0];
          setSelectedKey(key);
          if (key == "همه") {
            setFilter("");
          } else {
            setFilter(key);
          }
        }}
      >
        <DropdownItem key="همه">همه</DropdownItem>
        <DropdownItem key="دیباگ">دیباگ</DropdownItem>
        <DropdownItem key="کلاس خصوصی">کلاس خصوصی</DropdownItem>
        <DropdownItem key="مشاوره">مشاوره</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const NotificationActitvities = () => {
  return (
    <div className=" w-full rounded-xl box-border overflow-y-auto ">
      <ChatList />
      {/* <Card className="mb-2" radius="sm">
        <CardHeader className="flex gap-2">
          <Button
            radius="full"
            startContent={<MoveDownLeft />}
            variant="flat"
            isDisabled
            color="success"
            isIconOnly
          ></Button>
          <span className="text-lime-500">+ 200,000</span>
          <div className="flex-1"></div>
          <Chip size="md" variant="flat" color="success" className="text-xs">
            موفق
          </Chip>
        </CardHeader>
        <CardBody className="flex mb-5">
          <span className="text-xs">واریز به حساب شما</span>
        </CardBody>

        <CardFooter>
          <span className="text-xs text-foreground-500">
            {new Date().toLocaleDateString("fa-IR", {
              year: "numeric",
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </CardFooter>
      </Card> */}
    </div>
  );
};

export const DebugerRequest = () => {
  const { filter, setFilter } = useRequestFilter();

  return (
    <>
      <div className="h-20 w-full flex gap-2 p-5 box-border bg-foreground-50 rounded-tr-2xl rounded-tl-2xl">
        <Input
          startContent={<Search className="stroke-foreground-300" />}
          placeholder="جستجوی پیام ها ..."
          onValueChange={(value) => {
            setFilter(value);
          }}
        />
        <FilterDropDown />
      </div>
      <div className="flex flex-wrap flex-col gap-4 w-full h-full">
        <Tabs
          aria-label="Options"
          radius="full"
          size="sm"
          fullWidth
          className="rounded-tr-2xl rounded-tl-2xl flex items-center justify-start box-border py-2 px-5"
          classNames={{
            tabList: "gap-6 w-full relative  rounded-none p-0 border-divider",
            cursor: "w-full !bg-foreground-100",
            tab: "w-full px-5",
            tabContent: "group-data-[selected=true]:text-[#ffffff]",
          }}
          variant="light"
        >
          <Tab key="messages" title="پیام ها">
            <div className="w-full ">
              <NotificationActitvities />
            </div>
          </Tab>
          <Tab key="requests" title="درخواست ها">
            <div className="w-full flex flex-col">
              <RequetsList />
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

const SupportFAQ = ({ data, user }: { data: any[]; user: Main }) => {
  const [state, setState] = useState({
    title: "",
    description: "",
    problem: "",
    email: user.email,
    phone: user.user_phone,
    created_at: new Date(),
  });
  const [isLoading, setIsloading] = useState<boolean>(false);

  const submitRequest = async () => {
    setIsloading(true);
    await axios
      .post("/api/support/", state)
      .then((res) => {
        if (res.status == 201) {
          addToast({
            title: "درخواست پشتیبانی",
            description: `درخواست شما با موفقیت ثبت شد به زودی به شماره تلفن ${user.user_phone} تماس گرفته خواهد شد`,
            color: "success",
          });
          setIsloading(false);
        }
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err);
      });
  };

  return (
    <Accordion variant="splitted">
      {data &&
        data
          .sort((a, b) => a.priority - b.priority)
          .map((item, index) => {
            return (
              <AccordionItem
                className="bg-c_background/30"
                key={item._id}
                aria-label="Accordion 1"
                title={item.title}
                onPress={() => setState({ ...state, problem: item.title })}
              >
                <div key={item.title} className="flex flex-col w-full gap-4">
                  <span className="text-default-foreground text-xs font-lightSans">
                    {item.description}
                  </span>
                  <RadioGroup
                    onValueChange={(value) =>
                      setState({ ...state, title: value })
                    }
                  >
                    {item.option &&
                      item.options.map((option: any) => {
                        return (
                          <Radio key={option.title} value={option.title}>
                            {option.title}
                          </Radio>
                        );
                      })}
                  </RadioGroup>

                  <Textarea
                    minRows={4}
                    maxRows={6}
                    variant="underlined"
                    onValueChange={(value) =>
                      setState({ ...state, description: value })
                    }
                    placeholder="توضیحات خود را بنویسید"
                    endContent={
                      <div className="flex gap-4 ">
                        <Button
                          isIconOnly
                          size="md"
                          color="primary"
                          startContent={<File />}
                          variant="flat"
                        ></Button>
                        <Button
                          variant="flat"
                          color="primary"
                          size="md"
                          onPress={submitRequest}
                          isLoading={isLoading}
                        >
                          ارسال تیکت
                        </Button>
                      </div>
                    }
                  />
                </div>
              </AccordionItem>
            );
          })}
    </Accordion>
  );
};

const RankTab = ({ user }: { user: Main }) => {
  const comments = user.user_main_comment;
  const rateCalc = () => {
    if (!comments.length) return { total: 0, average: 0 };

    const total = comments.reduce((sum, item) => sum + item.rate, 0);
    const average = total / comments.length;

    return { total, average };
  };

  const { total, average } = rateCalc();
  return (
    <div className="min-h-[600px] text-white">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div></div>
          {/* <ChevronLeft className="text-white" /> */}
        </div>

        {/* Rating Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {total == 0 && "نظری ثبت نشده"}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-gray-300 text-sm">{total} از تعداد</span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-[#252a32] flex flex-col gap-3 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
              <span className="text-sm">5</span>
            </div>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-[#3a3f47] rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-400">0</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
              <span className="text-sm">4</span>
            </div>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-[#3a3f47] rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-400">0</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
              <span className="text-sm">3</span>
            </div>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-[#3a3f47] rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-400">0</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
              <span className="text-sm">2</span>
            </div>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-[#3a3f47] rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-400">0</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
              <span className="text-sm">1</span>
            </div>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-[#3a3f47] rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-400">0</span>
          </div>

          <div className="text-xs text-gray-400 text-center mt-4 rtl">
            بر اساس ۱۰۰ خدمات دهی امتیازدهی شده اخیر
          </div>
        </div>

        {/* Medals Section */}

        {/* Popular Choices */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-4">
            :پرتکرارترین گزینه‌های انتخابی کاربرا
          </h2>
          {comments.length <= 0 ? (
            <div className="w-full h-20 border border-slate-800 rounded-lg flex items-center justify-center">
              هنوز نظری برای شما ثبت نشده
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {comments.map((item) => {
                const tags = item.tags.split(",");
                return tags.map((tag) => {
                  return (
                    <button className="bg-[#252a32] border border-green-600 text-green-500 rounded-lg py-3 px-4 text-sm">
                      {tag}
                    </button>
                  );
                });
              })}
            </div>
          )}
        </div>

        {/* Comments Section */}
      </div>
    </div>
  );
};
