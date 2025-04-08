"use client";
import { setShowRequest } from "@/redux/slices/globalSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { Button } from "@heroui/react";
import { Power, Settings, Star } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};

const OnlineAction = (props: Props) => {
  const {showNewRequest} = useAppSelector((state: RootState) => state.gloabal);
  const dispatch = useAppDispatch()

  return (
    <div className=" h-32 flex items-center justify-center relative z-[99] rounded-3xl">
      <Button
        endContent={<Settings />}
        variant="light"
        className="absolute right-12 bottom-16"
      >
        تنظیمات
      </Button>
      <Button
        endContent={<Star />}
        variant="light"
        className="absolute left-12 bottom-16"
      >
        تسک منتخب
      </Button>
      <Button
      onPress={()=>{
        dispatch(setShowRequest(true));
        console.log("first");
        console.log(showNewRequest)
      }}
        startContent={<Power color={showNewRequest ? "red" : "white"} size={36} />}
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
