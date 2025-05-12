"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  User,
  Select,
  SelectItem,
  Tooltip,
  Divider,
  Input,
  Textarea,
  DatePicker,
  NumberInput,
} from "@heroui/react";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  CircleFadingPlusIcon,
  Gavel,
  Image,
  X,
} from "lucide-react";
import { LibraIcon } from "@/components/ui/icons";
import { tenderContext, TenderProvider } from "@/context/UploadTenderContext";
import { I18nProvider, useDateFormatter } from "@react-aria/i18n";
import { start } from "repl";
import { set } from "date-fns";
import { FileUpload } from "../ui/file-upload";
import {
  DateValue,
  parseDate,
  getLocalTimeZone,
} from "@internationalized/date";
import ImageUploader from "../UploadImage";
import axios from "axios";
import { perform_get, perform_post } from "@/lib/api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { Main, Public } from "@/components/types/RequestListForBid";
import { formatCurrency } from "@/utils/tools";
import TenderBidsList from "./TenderBidsList";
import TednerCancelation from "./TenderCancelation";
type Bid = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  // نوع کلاس: private, public یا consultation
  classType: "private" | "public" | "consultation";
  date: string;
  amount: string;
  status: "approved" | "pending" | "rejected";
};

const bids: Bid[] = [
  {
    id: 1,
    name: "Jane Doe",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    classType: "private", // کلاس خصوصی
    date: "1402/07/20",
    amount: "1,000,000 تومان",
    status: "pending",
  },
  {
    id: 2,
    name: "Ali Reza",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?u=b02358114e29026702d",
    classType: "public", // کلاس عمومی
    date: "1402/07/22",
    amount: "750,000 تومان",
    status: "approved",
  },
  {
    id: 3,
    name: "Sara Mohammadi",
    role: "UI Specialist",
    avatar: "https://i.pravatar.cc/150?u=c12358114e29026702d",
    classType: "consultation", // مشاوره
    date: "1402/07/25",
    amount: "600,000 تومان",
    status: "rejected",
  },
];

const classOptions = [
  { key: "all", label: "همه" },
  { key: "private", label: "کلاس خصوصی" },
  { key: "public", label: "کلاس عمومی" },
  { key: "consultation", label: "مشاوره" },
];

const statusOptions = [
  { key: "all", label: "همه" },
  { key: "approved", label: "تایید شده" },
  { key: "pending", label: "در حال بررسی" },
  { key: "rejected", label: "رد شده" },
];

const BidIncomingList = () => {
  const [tenderClass, setTenderClass] = useState<Main>();

  useEffect(() => {
    const getAllClassData = async () => {
      const response = await perform_get("api/v1/get_all_tender_class/");
      if (response.status === 404) {
        console.log(response.data);
      } else {
        console.log(response);
        setTenderClass(response);
      }
    };
    getAllClassData();
  }, []);

  // برای هر دو فیلتر مقدار پیش‌فرض "همه"
  const [selectedClass, setSelectedClass] = React.useState<any>(
    new Set(["all"])
  );
  const [selectedStatus, setSelectedStatus] = React.useState<any>(
    new Set(["all"])
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const filteredBids = bids.filter((bid) => {
    // فیلتر کلاس:
    const classFilterActive = !selectedClass.has("all");
    const statusFilterActive = !selectedStatus.has("all");

    const matchClass = classFilterActive
      ? selectedClass.has(bid.classType)
      : true;
    const matchStatus = statusFilterActive
      ? selectedStatus.has(bid.status)
      : true;

    return matchClass && matchStatus;
  });

  return (
    <TenderProvider>
      <div
        className={`${
          isOpen ? "w-[700px]" : "w-[500px]"
        } transition-all duration-500 ease-in-out h-full flex flex-col gap-4 relative`}
      >
        <UploadBidSection setIsOpen={setIsOpen} />
        {/* بخش فیلترها */}
        <div className="w-full h-20 gap-3 flex items-center justify-between bg-default-50 rounded-t-3xl box-border p-4">
          <Select
            fullWidth
            label="نوع کلاس"
            placeholder="انتخاب کلاس"
            selectedKeys={selectedClass}
            selectionMode="single"
            onSelectionChange={setSelectedClass}
          >
            {classOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
          <Select
            fullWidth
            label="وضعیت"
            placeholder="انتخاب وضعیت"
            selectedKeys={selectedStatus}
            selectionMode="single"
            onSelectionChange={setSelectedStatus}
          >
            {statusOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* بخش نمایش بیدها */}
        <div className="w-full h-full flex flex-col gap-2 overflow-y-auto box-border px-4 py-1">
          <PublicAuctionRquestList public_data={tenderClass?.public || []} />
          <PrivateTenderRquestList private_data={tenderClass?.private || []} />
        </div>
      </div>
    </TenderProvider>
  );
};

export default BidIncomingList;

const PublicAuctionRquestList = ({
  public_data,
}: {
  public_data: Public[];
}) => {
  return (
    <Accordion variant="splitted" dir="rtl">
      <AccordionItem
        key={"public"}
        aria-label="public"
        title={<div className="text-tiny">کلاس عمومی</div>}
      >
        {public_data.map((item) => {
          return (
            <div
              className="w-full py-4 my-2 bg-default-100 rounded-xl box-border px-2"
              key={item.id}
            >
              <div className="flex items-center  gap-2">
                <div className="flex-1">
                  <User
                    name={item.title.substring(0, 24)}
                    avatarProps={{
                      src: item.image || "/user.jpg",
                    }}
                  />
                </div>
                <TenderBidsList bids={item.bids} title={item.title} />
               <TednerCancelation tender_uuid={item.uuid}/>
              </div>
            </div>
          );
        })}
        {public_data.length == 0 && <span>کلاسی وجود ندارد</span>}
      </AccordionItem>
    </Accordion>
  );
};

const PrivateTenderRquestList = ({
  private_data,
}: {
  private_data: Public[];
}) => {
  return (
    <Accordion variant="splitted" dir="rtl">
      <AccordionItem
        key={"public"}
        aria-label="public"
        title={<div className="text-tiny">کلاس خصوصی</div>}
      >
        {private_data.map((item) => {
          return (
            <Accordion key={item.id} variant="splitted" className="my-2">
              <AccordionItem
                title={item.title.substring(0, 24)}
                aria-label={`tender ${item.id}`}
                className="text-tiny font-lightSans bg-default-100"
              >
                {item.bids.map((bid) => {
                  return (
                    <Accordion key={bid.id} variant="splitted">
                      <AccordionItem
                        aria-label={`user_bid_${bid.id}`}
                        className="my-2 gap-2"
                        title={
                          <div className="flex gap-3 items-center">
                            <User
                              name={
                                bid.user.first_name + " " + bid.user.last_name
                              }
                              avatarProps={{
                                src: bid.user.image_profile || "/user.jpg",
                              }}
                            />
                            <span className="text-tiny">
                              {formatCurrency(Number(bid.amount), false)}
                            </span>
                          </div>
                        }
                      >
                        <div className="flex gap-2 w-full">
                          <Button variant="solid" color="success">
                            تایید
                          </Button>
                          <Button variant="flat" color="danger">
                            رد درخواست
                          </Button>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  );
                })}
                {item.bids.length == 0 && (
                  <div className="w-full text-center py-2">
                    کاربری شرکت نکرده
                  </div>
                )}
              </AccordionItem>
            </Accordion>
          );
        })}
        {private_data.length == 0 && <span>کلاسی وجود ندارد</span>}
      </AccordionItem>
    </Accordion>
  );
};

const UploadBidSection = ({
  setIsOpen,
}: {
  setIsOpen: (show: boolean) => void;
}) => {
  const [showUpload, setShowUpload] = React.useState(false);
  const [page, setPage] = React.useState<number>(1);
  const { tender, setTenderData } = tenderContext();
  return (
    <>
      <div className="absolute bottom-3 flex gap-2 items-center w-full justify-center box-border p-5">
        <Button
          fullWidth
          className="bg-white text-background"
          variant="solid"
          onPress={() => {
            setPage(1);
            setIsOpen(true);
            setShowUpload(true);
            setTenderData({ ...tender, mode: "auction" });
          }}
          endContent={<LibraIcon />}
        >
          آگهی جدید
        </Button>
        <Button
          fullWidth
          color="primary"
          variant="solid"
          onPress={() => {
            setPage(1);
            setIsOpen(true);
            setShowUpload(true);
            setTenderData({ ...tender, mode: "tender" });
          }}
          endContent={<Gavel />}
        >
          مزایده جدید
        </Button>
      </div>

      <div
        className={`absolute box-border z-50 p-5 transition-all duration-500 ${
          showUpload ? "w-full h-[100%]" : "w-0 h-[0%] opacity-0 -z-10"
        }`}
      >
        <div className="w-full h-full flex flex-col rounded-3xl bg-default-50 box-border p-5">
          {page === 1 && (
            <PageOneUpload
              setPage={setPage}
              setShowUpload={setShowUpload}
              onClose={setIsOpen}
            />
          )}
          {page === 2 && (
            <PageTwoUpload
              setPage={setPage}
              setShowUpload={setShowUpload}
              onClose={setIsOpen}
            />
          )}
        </div>
      </div>
    </>
  );
};

const PageOneUpload = ({
  setPage,
  setShowUpload,
  onClose,
}: {
  setPage: (number: number) => void;
  setShowUpload: (show: boolean) => void;
  onClose: (show: boolean) => void;
}) => {
  const { project, setProjectData, setTenderData, images, tender } =
    tenderContext();
  const [isLoading, setIsloading] = useState(false);

  // const createProjectHandler = async ()=>{
  //   if (!project) {
  //     console.error("Project data is null or undefined.");
  //     return;
  //   }

  //   const formData = new FormData();

  //   Object.entries(project).forEach(([key, value]) => {
  //     if (value !== undefined && value !== null) {
  //       if (value instanceof File) {
  //         formData.append(key, value); // File
  //       } else {
  //         formData.append(key, String(value)); // Convert to string for safety
  //       }
  //     }
  //   });

  //   // Example usage to avoid unused variable error
  //   console.log("Form data prepared:", formData);
  //   const response = await perform_post("api/v1/create_project/", formData);
  //   console.log(response);
  // };

  const createImageProject = async (project_id: number) => {
    console.log(project_id);
    try {
      const promises = images.map((data) =>
        axios.post(
          `${process.env.server}/api/v1/project_image/`,
          {
            image: data.file,
            project: project_id,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      );

      const results = await Promise.all(promises);

      results.forEach((res, index) => {
        console.log(`Success [${index}]:`, res.data);
      });
    } catch (error) {
      console.error("One or more requests failed:", error);
    }
  };

  const createProjectHandler = async () => {
    setIsloading(true);

    const token = Cookies.get("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/create_project/",
        { ...project, is_tender: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTenderData({ ...tender, project: response.data.id });
      if (images.length > 0) {
        await createImageProject(response.data.id);
      }
      setIsloading(false);
      console.log("✅ موفقیت:", response.data);
      setPage(2);
    } catch (error: any) {
      setIsloading(false);
      console.error("❌ خطا:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <div className="w-full flex justify-start">
        <Button
          startContent={<ArrowLeft />}
          variant="light"
          isIconOnly
          size="md"
          onPress={() => {
            setShowUpload(false);
            onClose(false);
            setShowUpload(false);
          }}
        ></Button>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <Card dir="rtl" className="flex-1">
          <CardHeader>
            <div className="w-full ">
              <ImageUploader />
              {/* <FileUpload onChange={handleFileUpload} /> */}
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
              <div className="flex w-full gap-2 items-center justify-between">
                <I18nProvider locale="fa-IR">
                  <DatePicker
                    onChange={(value) => {
                      setProjectData({
                        ...project,
                        start_date: value?.toString(),
                      });
                    }}
                    fullWidth
                    isRequired
                    label="شروع کلاس"
                  />
                </I18nProvider>
                <I18nProvider locale="fa-IR">
                  <DatePicker
                    onChange={(value) => {
                      setProjectData({
                        ...project,
                        end_date: value?.toString(),
                      });
                    }}
                    fullWidth
                    isRequired
                    label="پایان کلاس"
                  />
                </I18nProvider>
              </div>
              <Input
                isRequired
                label="عنوان آموزش"
                labelPlacement="inside"
                type="text"
                onValueChange={(value) =>
                  setProjectData({ ...project, class_title: value })
                }
              />
              <Textarea
                isRequired
                type="text"
                labelPlacement="inside"
                label="توضیحات آموزش"
                onValueChange={(value) =>
                  setProjectData({ ...project, description: value })
                }
              />

              <Textarea
                className="h-full"
                fullWidth
                isRequired
                type="text"
                labelPlacement="inside"
                label="سرفصل ها"
                onValueChange={(value) =>
                  setProjectData({ ...project, educational_heading: value })
                }
              />
              <Input
                type="file"
                onChange={(e) => {
                  setProjectData({
                    ...project,
                    educational_heading_file: e.target.files
                      ? e.target.files[0]
                      : null,
                  });
                }}
              />
            </div>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </div>
      <Button
        color="success"
        variant="flat"
        onPress={createProjectHandler}
        isDisabled={isLoading}
        isLoading={isLoading}
      >
        بعدی
      </Button>
    </>
  );
};
const PageTwoUpload = ({
  setPage,
  setShowUpload,
  onClose,
}: {
  setPage: (number: number) => void;
  setShowUpload: (show: boolean) => void;
  onClose: (show: boolean) => void;
}) => {
  const { tender, project, setTenderData } = tenderContext();
  const createTender = async () => {
    const token = Cookies.get("token");

    const user_id: any = jwtDecode(token || "");

    console.log(token);
    const response = await axios.post(
      `http://127.0.0.1:8000/api/v1/tender_project/`,
      { ...tender, created_by: user_id.user_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = await response.data;
    if (data) {
      console.log(response.data);
      window.location.href = "/bid";
    }
  };

  return (
    <>
      <div className="w-full flex justify-start">
        <Button
          startContent={<ArrowLeft />}
          variant="light"
          isIconOnly
          size="md"
          onPress={() => {
            setPage(1);
          }}
        ></Button>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Card dir="rtl" className="flex-1">
          <CardHeader>
            {/* <div className="w-full h-48 border-default-100 rounded-3xl border border-dashed flex items-center justify-center">
              <Input
                required
                type="file"
                fullWidth={false}
                startContent={<Image />}
              />
            </div> */}
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2">
              <div className="flex w-full gap-2 items-center justify-between">
                <Input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setTenderData({ ...tender, image: e.target.files[0] });
                    }
                  }}
                />
                <I18nProvider locale="fa-IR">
                  <DatePicker
                    fullWidth
                    onChange={(value) => {
                      setTenderData({
                        ...tender,
                        start_time: value?.toString(),
                      });
                    }}
                    isRequired
                    label="شروع مزایده"
                  />
                </I18nProvider>
                <I18nProvider locale="fa-IR">
                  <DatePicker
                    onChange={(value) => {
                      setTenderData({
                        ...tender,
                        end_time: value?.toString(),
                      });
                    }}
                    fullWidth
                    isRequired
                    label="پایان مزایده"
                  />
                </I18nProvider>
              </div>
              <Input
                isRequired
                label="عنوان"
                labelPlacement="inside"
                type="text"
                onValueChange={(value) =>
                  setTenderData({ ...tender, title: value })
                }
              />
              <Textarea
                isRequired
                type="text"
                labelPlacement="inside"
                label="توضیحات"
                onValueChange={(value) =>
                  setTenderData({ ...tender, description: value })
                }
              />
            </div>
          </CardBody>
          <CardFooter>
            <SubmitPrice />
          </CardFooter>
        </Card>
        <Button color="success" variant="flat" onPress={createTender}>
          ثبت
        </Button>
      </div>
    </>
  );
};
const PageThreeUpload = ({
  setPage,
}: {
  setPage: (number: number) => void;
}) => {
  return (
    <>
      <div className="w-full flex justify-start">
        <Button
          startContent={<ArrowLeft />}
          variant="light"
          isIconOnly
          size="md"
          onPress={() => setPage(2)}
        ></Button>
      </div>
      <div className="flex-1">3</div>
      <Button
        color="success"
        variant="flat"
        onPress={() => console.log("first")}
      >
        ثبت
      </Button>
    </>
  );
};

const SubmitPrice = () => {
  const { tender, setTenderData } = tenderContext();
  if (tender?.mode == "tender") {
    return (
      // <div className="flex items-center gap-2 w-full justify-center">
      <NumberInput
        isRequired
        defaultValue={1024}
        label="حداقل"
        onValueChange={(value) =>
          setTenderData({ ...tender, start_bid: value })
        }
      />
      // </div>
    );
  }
  return (
    // <div className="flex items-center gap-2 w-full justify-center">
    <NumberInput
      isRequired
      defaultValue={1024}
      label="حداکثر"
      onValueChange={(value) => setTenderData({ ...tender, start_bid: value })}
    />
    // </div>
  );
};
