"use client";
import { formatCurrency, getCurrentPersianMonth, getMonthNames } from "@/utils/tools";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Tab,
  Tabs,
  User,
} from "@heroui/react";
import {
  CreditCard,
  Filter,
  History,
  Home,
  Mail,
  MoveDownLeft,
  MoveUpRight,
  Search,
} from "lucide-react";
import { div } from "motion/react-client";
import React, { useEffect, useRef, useState } from "react";

type Props = {};

const Wallet = (props: Props) => {
  return (
    <div className="w-full flex h-full flex-wrap gap-4   box-border pb-4 justify-center">
      <Tabs
        color="primary"
        aria-label="Tabs variants"
        variant="light"
        placement="bottom"
        className="w-96 px-4"
        classNames={{
          // base:"rounded-3xl",
          tab: "p-0",
          tabContent: "h-10 flex items-center justify-center",
          panel: "p-0",
        }}
        fullWidth
        size="lg"
        radius="full"
      >
        <Tab key="home" className="w-full h-full" title={<Home />}>
          <TabHome />
        </Tab>

        <Tab
          key="history"
          className="w-full h-full"
          title={
            <div className="flex gap-2 items-center">
              <History />
              <Chip variant="flat" color="primary" size="sm" radius="full">
                5
              </Chip>
            </div>
          }
        >
          <TabHistory />
        </Tab>
        <Tab
          key="notfication"
          className="w-full h-full"
          title={
            <div className="flex gap-2 items-center">
              <Mail />
              <Chip variant="flat" color="primary" size="sm" radius="full">
                5
              </Chip>
            </div>
          }
        >
          <TabNotification />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Wallet;

const TabHome = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="w-full flex-1 bg-[radial-gradient(circle,_var(--tw-gradient-stops))]  from-violet-800 to-violet-400 rounded-3xl relative">
        <span className="absolute left-4 bottom-2 text-xl text-slate-200">
          {formatCurrency(500000, true)}
        </span>
      </div>
      <div className="h-4/6 flex flex-col px-2 gap-2">
        <ActionButtons />
        <FinancialActivities />
      </div>
    </div>
  );
};

const TabHistory = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="w-full flex-1 bg-[radial-gradient(circle,_var(--tw-gradient-stops))]  from-violet-800 to-violet-400 rounded-3xl relative">
        <span className="absolute left-4 bottom-2 text-xl text-slate-200">
          {formatCurrency(500000, true)}
        </span>
      </div>
      <div className="h-4/6 flex flex-col px-1 gap-2">
        <FilterAction />
        <FinancialActivities />
      </div>
    </div>
  );
};

const TabNotification = () => {
  return(
    <div className="h-full flex flex-col gap-2 box-border p-2">
        <FilterNotificationAction />
        <div className="flex-1 h-4/5" dir="rtl">

        <FilterNotificationContent />
        </div>
    </div>
  )
};



const FilterNotificationAction = ()=>{

      const filterOptions = ["همه", "لایک", "کامنت", "فالو"].reverse();
    
      const [selectedFilter, setSelectedFilter] = useState<string>("همه");
    
      const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
    
      useEffect(() => {
        const currentIndex = filterOptions.indexOf(selectedFilter);
        if (currentIndex !== -1 && filterRefs.current[currentIndex]) {
          filterRefs.current[currentIndex].scrollIntoView({
            behavior: "smooth",
            inline: "center",
          });
        }
      }, [selectedFilter]);
    
      return (
        <div className="w-full h-auto flex items-center justify-between p-2 gap-2 bg-[#18181b] rounded-2xl">
          <div className="max-w-full h-14 w-full overflow-x-scroll whitespace-nowrap flex items-center gap-4 px-2 scrollbar-hide justify-end">
            {filterOptions.map((item, index) => (
              <div
                key={item}
                ref={(el: any) => (filterRefs.current[index] = el!)}
                className="cursor-pointer"
                onClick={() => setSelectedFilter(item)} 
              >
                <Chip
                  variant={item === selectedFilter ? "solid" : "flat"} 
                  color="primary"
                  className="shrink-0"
                >
                  {item}
                </Chip>
              </div>
            ))}
          </div>
    
    
        </div>
      );
}


// Define notification types
type NotificationType = "text" | "image" | "action"

interface NotificationItem {
  id: string
  type: NotificationType
  username: string
  message: string
  time: string
  avatar?: string
  actionLabel?: string
}

const FilterNotificationContent = ()=>{
    // Sample data for notifications
  const [todayNotifications, setTodayNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      type: "text",
      username: "hesam_91_47",
      message: "حلقه فیلم شما را پسندید.",
      time: "۲ ساعت",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    },
    {
      id: "2",
      type: "image",
      username: "about_shamim_1000jobs.ir",
      message: "محتوای دیگر از شما دعوت کرد تا کانال بیشتر؟",
      time: "۵ ساعت",
      avatar: "https://i.pravatar.cc/150?u=b14258114e29026702c",
    },
    {
      id: "3",
      type: "action",
      username: "moha90mmd",
      message: "شما را دنبال کرد.",
      time: "۱ روز",
      avatar: "https://i.pravatar.cc/150?u=c24258114e29026702b",
      actionLabel: "دنبال کردن متقابل",
    },
  ])

  const [lastWeekNotifications, setLastWeekNotifications] = useState<NotificationItem[]>([
    {
      id: "4",
      type: "text",
      username: "lighter_iiii",
      message: "حلقه فیلم شما را پسندید.",
      time: "۳ روز",
      avatar: "https://i.pravatar.cc/150?u=d34258114e29026702a",
    },
    {
      id: "5",
      type: "image",
      username: "mohadese.akbarabadi",
      message: "حلقه فیلم شما را پسندید.",
      time: "۳ روز",
      avatar: "https://i.pravatar.cc/150?u=e44258114e29026702z",
    },
  ])

  const [lastMonthNotifications, setLastMonthNotifications] = useState<NotificationItem[]>([
    {
      id: "6",
      type: "text",
      username: "kani_abbasii",
      message: "و دیگر نظرات را پسندید: زندگی من قبل و بعد کو...",
      time: "۳ روز",
      avatar: "https://i.pravatar.cc/150?u=f54258114e29026702y",
    },
    {
      id: "7",
      type: "image",
      username: "mehdi.m2731",
      message: "حلقه فیلم شما را پسندید.",
      time: "۳ روز",
      avatar: "https://i.pravatar.cc/150?u=g64258114e29026702x",
    },
    {
      id: "8",
      type: "action",
      username: "_mohammadensaeid",
      message: "شما را دنبال کرد.",
      time: "۱ هفته",
      avatar: "https://i.pravatar.cc/150?u=h74258114e29026702w",
      actionLabel: "دنبال کردن متقابل",
    },
  ])

  // Render notification based on its type
  const renderNotification = (notification: NotificationItem) => {
    return (
      <div key={notification.id} className="flex items-start gap-3 py-3 border-b border-gray-800">
        {notification.type === "image" && (
          <User
            avatarProps={{
              src: notification.avatar,
            }}
            description={notification.message}
            name={notification.username}
          />
        )}

        {notification.type === "text" && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={notification.avatar || "/placeholder.svg"}
                alt={notification.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-white">{notification.username}</span>
              </div>
              <p className="text-gray-300 text-sm">{notification.message}</p>
              <span className="text-gray-500 text-xs">{notification.time}</span>
            </div>
          </div>
        )}

        {notification.type === "action" && (
          <div className="flex items-start justify-between w-full gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={notification.avatar || "/placeholder.svg"}
                  alt={notification.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white">{notification.username}</span>
                </div>
                <p className="text-gray-300 text-sm">{notification.message}</p>
                <span className="text-gray-500 text-xs">{notification.time}</span>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">{notification.actionLabel}</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-right">جدید</h1>

      {/* Today's notifications */}
      <div className="mb-6">
        <h2 className="text-gray-400 text-sm mb-2 text-right">امروز</h2>
        <div className="space-y-1">{todayNotifications.map((notification) => renderNotification(notification))}</div>
      </div>

      {/* Last week's notifications */}
      <div className="mb-6">
        <h2 className="text-gray-400 text-sm mb-2 text-right">۷ روز اخیر</h2>
        <div className="space-y-1">{lastWeekNotifications.map((notification) => renderNotification(notification))}</div>
      </div>

      {/* Last month's notifications */}
      <div>
        <h2 className="text-gray-400 text-sm mb-2 text-right">۳۰ روز اخیر</h2>
        <div className="space-y-1">
          {lastMonthNotifications.map((notification) => renderNotification(notification))}
        </div>
      </div>
    </div>
  )
}














const ActionButtons = () => {
  const actions = [
    {
      name: "برداشت",
      icon: MoveUpRight,
    },
    {
      name: "افزایش",
      icon: MoveDownLeft,
    },
    {
      name: "کارت ها",
      icon: CreditCard,
    },
  ];
  return (
    <div className="h-36 w-full rounded-3xl bg-black flex items-center justify-between box-border  p-2">
      {actions.map((item) => {
        return (
          <div
            className="flex flex-col items-center justify-center gap-1"
            key={item.name}
          >
            <Button
              variant="flat"
              color="default"
              startContent={<item.icon />}
              className="w-24 h-20"
              radius="lg"
              isIconOnly
              size="lg"
            ></Button>
            <span className="text-xs">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

const FinancialActivities = () => {
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
              hour:"numeric",
              minute:"numeric"
            })}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

const FilterAction = () => {
    const FilterButton = [
      { name: "فیلتر", icon: Filter },
      { name: "پیام ها", icon: Mail },
      { name: "جستجو", icon: Search },
    ];
  
    const persianMonths = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ].reverse()
  
    const getCurrentPersianMonth = (): string => {
      return new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(new Date());
    };
    const currentMonth = getCurrentPersianMonth();
  
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  
    const monthRefs = useRef<(HTMLDivElement | null)[]>([]);
  
    useEffect(() => {
      const currentIndex = persianMonths.indexOf(selectedMonth);
      if (currentIndex !== -1 && monthRefs.current[currentIndex]) {
        monthRefs.current[currentIndex].scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }, [selectedMonth]);
  
    return (
      <div className="w-full h-auto flex items-center justify-between p-2 gap-2 bg-[#18181b] rounded-2xl">
        <div className="max-w-52  h-14 w-full overflow-x-scroll whitespace-nowrap flex items-center gap-4 px-2 scrollbar-hide">
          {persianMonths.map((item, index) => (
            <div
              key={item}
              ref={(el:any) => (monthRefs.current[index] = el!)}
              className="cursor-pointer"
              onClick={() => setSelectedMonth(item)} // ✅ هنگام کلیک ماه انتخاب‌شده را تنظیم می‌کنیم
            >
              <Chip
                variant={item === selectedMonth ? "solid" : "flat"} // ✅ اگر ماه انتخاب‌شده باشد، حالت "solid" می‌گیرد
                color="primary"
                className="shrink-0"
              >
                {item}
              </Chip>
            </div>
          ))}
        </div>
  
        {/* دکمه‌های کنترلی */}
        {FilterButton.map((item) => (
          <Button
            size="sm"
            isIconOnly
            variant="flat"
            radius="full"
            color="primary"
            startContent={<item.icon size={16} />}
            key={item.name}
          />
        ))}
      </div>
    );
  };
  