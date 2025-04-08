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
  File,
  Headset,
  History,
  MoveDownLeft,
  Search,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import { GetUserActivityHistoryTab } from "../TabsData";

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
          <div className="w-full h-full ">
            <div className="h-[600px] box-border p-5 overflow-y-auto">
            بخش اصلی
            </div>
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
            <div className="h-[600px] box-border p-5 overflow-y-auto">
              <SupportFAQ data={faq} user={user} />
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
            <div className="h-[600px] box-border p-5">
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
            <div className="h-[600px] box-border p-5">رتبه</div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

const FilterDropDown = () => {
  const [selectedKey, setSelectedKey] = React.useState("همه");

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
    <div className=" max-h-[400px] w-full rounded-xl box-border overflow-y-auto ">
      <Card className="mb-2" radius="sm">
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
      </Card>
    </div>
  );
};

export const DebugerRequest = () => {
  return (
    <>
      <div className="h-20 w-full flex gap-2 p-5 box-border bg-foreground-50 rounded-tr-2xl rounded-tl-2xl">
        <Input
          startContent={<Search className="stroke-foreground-300" />}
          placeholder="جستجوی پیام ها ..."
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
            <div className="w-full box-border p-5 ">
              <NotificationActitvities />
            </div>
          </Tab>
          <Tab key="requests" title="درخواست ها">
            تاریخچه
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
    problem:"",
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
      {data.map((item, index) => {
        return (
          <AccordionItem
            className="bg-c_background/30"
            key={item._id}
            aria-label="Accordion 1"
            title={item.title}
            onPress={()=>setState({...state,problem:item.title})}
          >
            <div key={item.title} className="flex flex-col w-full gap-4">
              <span className="text-default-foreground text-xs font-lightSans">
                {item.description}
              </span>
              <RadioGroup
                onValueChange={(value) => setState({ ...state, title: value })}
              >
                {item.options.map((option: any) => {
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
