"use client";
import { setShowNewRequest, setShowRequest } from "@/redux/slices/globalSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RangeCalendar,
  Switch,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { Headset, PhoneCall, Power, Settings, Star, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Cookies from "js-cookie";
type Props = {};

const OnlineAction = (props: Props) => {
  const { showNewRequest } = useAppSelector(
    (state: RootState) => state.gloabal
  );
  const dispatch = useAppDispatch();

  const showNewRequestHandler = () => {
    dispatch(setShowNewRequest(!showNewRequest));
    Cookies.set("is_online", !showNewRequest ? "true" : "false");
    Cookies.set("moshavere", "true");
    Cookies.set("debug", "true");
    Cookies.set("private_class", "true");
    Cookies.set("public_class", "true");
  };
  const [show, setShow] = useState<boolean>(true);

  return (
    <div
      className={`h-32 flex items-center justify-center relative z-[${
        show ? "9999" : "50"
      }] rounded-3xl`}
    >
      <ModalSettings setShow={setShow} show={show} />
      <ModalTask setShow={setShow} show={show}/>
      <Button
        onPress={showNewRequestHandler}
        startContent={
          <Power color={showNewRequest ? "red" : "white"} size={36} />
        }
        variant="light"
        color="danger"
        radius="full"
        isIconOnly
        className="absolute"
      ></Button>
      <Image src={"/svg/power.svg"} width={500} height={500} alt="power" />
    </div>
  );
};

export default OnlineAction;

const ModalSettings = ({
  setShow,
  show,
}: {
  setShow: (show: boolean) => void;
  show: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        endContent={<Settings />}
        onPress={() => {
          onOpen();
          setShow(!show);
        }}
        variant="light"
        className="absolute right-12 bottom-16"
      >
        تنظیمات
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        hideCloseButton
        backdrop="blur"

        dir="rtl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Settings size={20} />
                  <span className="font-lightSans !font-normal">تنظیمات</span>
                </div>
                <Button
                  isIconOnly
                  startContent={<X size={14} />}
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setShow(!show);
                    onClose();
                  }}
                ></Button>
              </ModalHeader>
              <ModalBody className="min-h-[500px] flex flex-col gap-4">
                <SettingTabContent />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export const SettingTabContent = () => {
  return (
    <div className="flex w-full flex-col ">
      <Tabs aria-label="Options" variant="underlined">
        {/* Notifications Tab */}
        {/* <Tab key="notifications" title="نوتیفیکیشن">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Switch defaultSelected>فعال‌سازی اعلان‌ها</Switch>
              <Switch>دریافت ایمیل</Switch>
              <Switch>نوتیفیکیشن مرورگر</Switch>
              <Switch>نوتیفیکیشن پیام جدید</Switch>
            </CardBody>
          </Card>
        </Tab> */}

        {/* Profile Tab */}
        {/* <Tab key="profile" title="پروفایل کاربر">
          <Card>
            <CardBody className="flex flex-col gap-6">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">انتخاب زبان</Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Language">
                  <DropdownItem key="fa">فارسی</DropdownItem>
                  <DropdownItem key="en">English</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Input
                type="text"
                label="نام نمایشی"
                placeholder="مثلاً علی احمدی"
              />
              <Switch defaultSelected>نمایش پروفایل عمومی</Switch>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">منطقه زمانی</Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Timezone">
                  <DropdownItem key="tehran">Asia/Tehran</DropdownItem>
                  <DropdownItem key="gmt">GMT</DropdownItem>
                  <DropdownItem key="utc">UTC</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
        </Tab> */}

        {/* Security Tab */}
        {/* <Tab key="security" title="امنیت و ورود">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Switch defaultSelected>فعال‌سازی احراز هویت دو مرحله‌ای</Switch>
              <Input
                type="password"
                label="تغییر رمز عبور"
                placeholder="رمز جدید"
              />
              <Switch>ورود خودکار در دستگاه‌های قابل‌اعتماد</Switch>
            </CardBody>
          </Card>
        </Tab> */}

        {/* Appearance Tab */}
        {/* <Tab key="appearance" title="ظاهر">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Switch defaultSelected>تم تاریک</Switch>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">انتخاب فونت</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="iransans">ایران‌سنس</DropdownItem>
                  <DropdownItem key="yekan">یکان</DropdownItem>
                  <DropdownItem key="vazir">وزیر</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">سایز نوشته</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="sm">کوچک</DropdownItem>
                  <DropdownItem key="md">متوسط</DropdownItem>
                  <DropdownItem key="lg">بزرگ</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
        </Tab> */}

        {/* AI Settings Tab */}
        {/* <Tab key="ai" title="هوش مصنوعی">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">انتخاب مدل</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="gpt-3.5">GPT-3.5</DropdownItem>
                  <DropdownItem key="gpt-4">GPT-4</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Switch defaultSelected>ذخیره تاریخچه چت</Switch>
              <Switch>فعال‌سازی پاسخ خلاقانه</Switch>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">تنظیم دقت پاسخ</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="low">پایین</DropdownItem>
                  <DropdownItem key="medium">متوسط</DropdownItem>
                  <DropdownItem key="high">زیاد</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
        </Tab> */}

        {/* History Tab */}
        {/* <Tab key="history" title="تاریخچه و داده‌ها">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Switch defaultSelected>ذخیره تاریخچه تعاملات</Switch>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">مدت نگهداری داده‌ها</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="1month">1 ماه</DropdownItem>
                  <DropdownItem key="3months">3 ماه</DropdownItem>
                  <DropdownItem key="forever">برای همیشه</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
        </Tab> */}

        {/* General Tab */}
        <Tab key="contact_us" title={"ارتباط با ما"}>
          <div className="w-full min-h-[400px] flex items-center justify-center flex-col gap-4">
            {/* <Image
          className="rounded-full"
          src={"/user.jpg"}
          alt="support_call"
          width={300}
          height={300}
          /> */}
            <div className="w-auto h-auto p-5 bg-secondary-200 rounded-full">
              <Headset size={90} className="stroke-secondary-900" />
            </div>
            <span className="mb-6">جهت ارتباط با کارشناسان تماس بگیرید</span>
            <Input
              className="max-w-96"
              type="tel"
              value={"+989029457261"}
              variant="faded"
              startContent={
                <Button
                  startContent={<PhoneCall size={14} />}
                  isIconOnly
                  variant="light"
                ></Button>
              }
            />
          </div>
        </Tab>

        {/* About Tab */}
        <Tab key="about" title={"درباره ما"}>
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">درباره تیم ما</Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="team">اعضای تیم</DropdownItem>
                  <DropdownItem key="contact">تماس با ما</DropdownItem>
                  <DropdownItem key="faq">سؤالات متداول</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <p className="text-medium max-w-2xl mx-auto text-gray-500 font-mediumSans text-wrap text-right">
                درباره ما ما یک تیم نرم‌افزاری هستیم که با هدف ساده‌سازی یادگیری
                و رفع مشکلات برنامه‌نویسی، پلتفرم «دیباگچی» را توسعه داده‌ایم.
                <br />
                <br />
                دیباگچی با بهره‌گیری از هوش مصنوعی، کاربران را در سریع‌ترین زمان
                ممکن به متخصصان واقعی در زمینه‌های مختلف از جمله دیباگ، مشاوره،
                و کلاس‌های خصوصی یا عمومی متصل می‌کند.
                <br />
                <br />
                هدف ما اینه که مسیر یادگیری و حل مسئله برای علاقه‌مندان و
                برنامه‌نویسان، ساده، سریع و موثر باشه.
              </p>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

const ModalTask = ({
  setShow,
  show,
}: {
  setShow: (show: boolean) => void;
  show: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        endContent={<Star />}
        onPress={() => {
          onOpen();
          setShow(!show);
        }}
        variant="light"
        className="absolute left-12 bottom-16"
      >
        تسک منتخب
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        backdrop="blur"
        dir="rtl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                  <Settings size={20} />
                  <span className="font-lightSans !font-normal">تنظیمات</span>
                </div>
                <Button
                  isIconOnly
                  startContent={<X size={14} />}
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setShow(!show);
                    onClose();
                  }}
                ></Button>
              </ModalHeader>
              <ModalBody className="min-h-[500px] flex flex-col gap-4">
                <TaskSettingsContent />
              </ModalBody>
            
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const TaskSettingsContent = () => {
  const is_debug = Cookies.get("debug");
  const is_private_class = Cookies.get("private_class");
  const is_moshavere = Cookies.get("moshavere");

  const changeStatus = (
    type: "debug" | "private_class" | "moshavere",
    status: boolean
  ) => {
    if (type == "debug") {
      Cookies.set("debug", String(status));
    } else if (type == "moshavere") {
      Cookies.set("moshavere", String(status));
    } else if (type == "private_class") {
      Cookies.set("private_class", String(status));
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4" dir="rtl">
      <Switch
        defaultSelected={is_debug == "true"}
        onValueChange={(value) => {
          changeStatus("debug", value);
        }}
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
          wrapper: "p-0 h-4 overflow-visible",
          thumb: cn(
            "w-6 h-6 border-2 shadow-lg",
            "group-data-[hover=true]:border-primary",
            "group-data-[selected=true]:ms-6",
            "group-data-[pressed=true]:w-7",
            "group-data-[selected]:group-data-[pressed]:ms-4"
          ),
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-medium">دیباگ</p>
          <p className="text-tiny text-default-400">
            دریافت پیام دیباگ کردن درخواست ها و تسک ها
          </p>
        </div>
      </Switch>
      <Switch
        defaultSelected={is_moshavere == "true"}
        onValueChange={(value) => {
          changeStatus("moshavere", value);
        }}
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
          wrapper: "p-0 h-4 overflow-visible",
          thumb: cn(
            "w-6 h-6 border-2 shadow-lg",
            "group-data-[hover=true]:border-primary",
            //selected
            "group-data-[selected=true]:ms-6",
            // pressed
            "group-data-[pressed=true]:w-7",
            "group-data-[selected]:group-data-[pressed]:ms-4"
          ),
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-medium">مشاوره</p>
          <p className="text-tiny text-default-400">
            دریافت پیام مشاوره در زمینه درخواست ها و تسک ها
          </p>
        </div>
      </Switch>
      <Switch
        defaultSelected={is_private_class == "true"}
        onValueChange={(value) => {
          changeStatus("private_class", value);
        }}
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
          wrapper: "p-0 h-4 overflow-visible",
          thumb: cn(
            "w-6 h-6 border-2 shadow-lg",
            "group-data-[hover=true]:border-primary",
            //selected
            "group-data-[selected=true]:ms-6",
            // pressed
            "group-data-[pressed=true]:w-7",
            "group-data-[selected]:group-data-[pressed]:ms-4"
          ),
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-medium">کلاس خصوصی</p>
          <p className="text-tiny text-default-400">
            دریافت پیام کلاس خصوصی در زمینه درخواست ها و تسک ها
          </p>
        </div>
      </Switch>
    </div>
  );
};
