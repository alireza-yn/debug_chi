import { Main } from "@/components/types/debug-request";
import { perform_get } from "@/lib/api";
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
} from "@heroui/react";
import React, { useEffect, useState } from "react";

type Props = {};

const RequetsList = (props: Props) => {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [data, setData] = useState<Main>({
    consult: [],
    debug: [],
  });

  useEffect(() => {
    setIsloading(true);
    const getRequest = async () => {
      const respone = await perform_get("api/v1/get-request/");
      if (respone.status == 400) {
        console.log("first");
        setIsloading(false);
      } else {
        setData(respone);
      }
    };
    getRequest();
  }, []);

  return (
    <div className="flex flex-col w-full flex-1 max-h-[700px]  gap-2 overflow-y-auto">
      <Accordion variant="splitted">
        {[...data?.consult.map((item) => (
          <AccordionItem
            key={item.id}
            aria-label={`Accordion ${item.id}`}
            title={
              <div className="flex items-center justify-between w-full">
                <User
                  avatarProps={{
                    src:
                      `${process.env.server}/${item.consult_applicator.image_profile}` ||
                      "/user.jpg",
                  }}
                  description={item.description.substring(0, 50) + " " + "..."}
                  name={item.consult_applicator.first_name}
                />
                <div className="text-sm text-gray-500">
                  <Chip size="sm">
                    {item.is_realtime === false ? "انلاین" : "زمان بندی شده"}
                  </Chip>
                </div>
              </div>
            }
          >
            <Card>
              <CardHeader />
              <CardBody>
                <div className="w-full h-full flex flex-col gap-2">
                  <div className="text-sm text-gray-500 flex items-center justify-end">
                    <Chip color="primary" size="sm" variant="flat">
                     مشاوره
                    </Chip>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center justify-between">
                    <span>
                      {item.start_at != null
                        ? new Date(item.start_at).toLocaleDateString("fa-IR", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })
                        : "زمانی انتخاب نشده"}
                    </span>
                    <span>تاریخ</span>
                  </div>
                  {/* <div className="text-sm text-gray-500 flex items-center justify-between">
                    <span>{item.price}</span>
                    <span>مبلغ</span>
                  </div> */}
                  <div className="text-sm text-gray-500 flex items-center justify-between">
                    <span>
                      {item.status === "open"
                        ? "فعال"
                        : item.status === "pending"
                        ? "در حال بررسی"
                        : "رد شده"}
                    </span>
                    <span>وضعیت</span>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex items-center gap-4 w-full">
                <Button color="success" fullWidth>
                  تایید
                </Button>
                <Button color="danger" variant="bordered" fullWidth>
                  رد درخواست
                </Button>
              </CardFooter>
            </Card>
          </AccordionItem>
        ))
        ,...data?.debug.map((item) => (
          <AccordionItem
            key={item.id}
            aria-label={`Accordion ${item.id}`}
            title={
              <div className="flex items-center justify-between w-full">
                <User
                  avatarProps={{
                    src:
                      `${process.env.server}/${item.debuger_applicator.image_profile}` ||
                      "/user.jpg",
                  }}
                  description={item.description.substring(0, 50) + " " + "..."}
                  name={item.debuger_applicator.first_name}
                />
                <div className="text-sm text-gray-500">
                  <Chip size="sm">
                    {item.is_realtime === false ? "انلاین" : "زمان بندی شده"}
                  </Chip>
                </div>
              </div>
            }
          >
            <Card>
              <CardHeader />
              <CardBody>
                <div className="w-full h-full flex flex-col gap-2">
                  <div className="text-sm text-gray-500 flex items-center justify-end">
                    <Chip color="primary" size="sm" variant="flat">
                      دیباگ
                    </Chip>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center justify-between">
                    <span>
                      {item.start_at != null
                        ? new Date(item.start_at).toLocaleDateString("fa-IR", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })
                        : "زمانی انتخاب نشده"}
                    </span>
                    <span>تاریخ</span>
                  </div>
                  {/* <div className="text-sm text-gray-500 flex items-center justify-between">
                    <span>{item.price}</span>
                    <span>مبلغ</span>
                  </div> */}
                  <div className="text-sm text-gray-500 flex items-center justify-between">
                    <span>
                      {item.status === "open"
                        ? "فعال"
                        : item.status === "pending"
                        ? "در حال بررسی"
                        : "رد شده"}
                    </span>
                    <span>وضعیت</span>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex items-center gap-4 w-full">
                <Button color="success" fullWidth>
                  بررسی درخواست
                </Button>
                <Button color="danger" variant="bordered" fullWidth>
                  رد درخواست
                </Button>
              </CardFooter>
            </Card>
          </AccordionItem>
        ))
        ]}
        
      </Accordion>
      {/* <Accordion variant="splitted">
     
      </Accordion> */}
    </div>
  );
};

export default RequetsList;
