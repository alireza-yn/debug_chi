"use client";
import { setShowRequest, showMoreRequest } from "@/redux/slices/globalSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { formatCurrency } from "@/utils/tools";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  form,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { Clock, ListFilter, Tag, Timer, User } from "lucide-react";
import React, { useState } from "react";

type Props = {};
const PriceBox = ({ price }: { price: number }) => {
  return (
    <div className="w-full h-20 bg-[#2b2839] box-border px-4 rounded-lg flex items-center justify-center">
      <div className="flex-1 flex items-center justify-start h-full gap-2">
        <User size={48} />
        <div className="flex flex-col gap-2">
          <span className="text-sm">مشاوره</span>
          <span className="text-foreground-500 text-xs">به صرفه</span>
        </div>
      </div>
      <div className="w-auto h-full flex items-center justify-center">
        <span className="text-white">{formatCurrency(price)}</span>
        {/* <span>تومان</span> */}
      </div>
    </div>
  );
};

const OptionRequest = () => {
  const dispatch = useAppDispatch();
  
  return (
    <div className="w-full h-20  box-border rounded-lg grid grid-cols-2 gap-x-2">
      <div className="flex bg-[#2b2839] items-center justify-center rounded-lg">
      <Button variant="light" startContent={<ListFilter />} onPress={()=>{dispatch(showMoreRequest(true))}}>
              گزینه های بیشتر
        </Button>


        {/* <Dropdown>
          <DropdownTrigger>
            <Button variant="light" startContent={<ListFilter />}>
              گزینه های بیشتر
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Delete file
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      </div>
      <div className="flex bg-[#2b2839] box-border px-10 items-center justify-center rounded-lg">
        <Input
          variant="underlined"
          color="default"
          startContent={<Tag />}
          placeholder="کد تخفیف"
        />
      </div>
    </div>
  );
};






const SubmitRequet = ({
  request_mode,
  close,
}: {
  request_mode: string;
  close: () => void;
}) => {
  return (
    <div className="w-full h-20 gap-4 box-border rounded-lg flex items-center justify-center">
      <Button isIconOnly color="primary" startContent={<Clock />}></Button>
      <div className="flex-1 grid grid-cols-2 gap-4">
        <Button color="primary">{request_mode}</Button>
        <Button color="danger" onPress={close}>
          لغو
        </Button>
      </div>
    </div>
  );
};

const RequestModal = (props: Props) => {

  const {showRequest} = useAppSelector((state:RootState)=>state.gloabal)
  const dispatch = useAppDispatch();
  // const [showRequest, SetshowRequest] = useState(true);
  const closeHandler = () => {
    // SetshowRequest(false);
    dispatch(setShowRequest(false))
  };
  
  return (
    <div
    dir="rtl"
      className={`${
        showRequest
          ? "h-min-[340px] w-full bg-[#232035] rounded-tr-lg rounded-tl-lg"
          : "w-full h-0 opacity-0"
      } absolute bottom-0 z-30 transition-all duration-500`}
    >
      {showRequest && (
        <div className="flex w-2/4 flex-col mx-auto">
          <Tabs aria-label="Options" variant="underlined" fullWidth>
            <Tab key="photos" title="چت" className="flex flex-col gap-4">
              <PriceBox price={600000} />
              <OptionRequest />
              <SubmitRequet
                request_mode="درخواست مشاوره و چت"
                close={closeHandler}
              />
            </Tab>
            <Tab key="music" title="صوتی" className="flex flex-col gap-4">
              <PriceBox price={500000} />
              <OptionRequest />
              <SubmitRequet
                request_mode="درخواست تماس صوتی"
                close={closeHandler}
              />
            </Tab>
            <Tab key="videos" title="تصویری" className="flex flex-col gap-4">
              <PriceBox price={400000} />
              <OptionRequest />
              <SubmitRequet
                request_mode="درخواست تماس تصویری"
                close={closeHandler}
              />
            </Tab>
          </Tabs>
        </div>
      )}


  
    </div>
  );
};

export default RequestModal;
