"use client";
import { showLogin } from "@/redux/slices/globalSlice";
import { useAppDispatch } from "@/redux/store/store";
import { Button, Tooltip } from "@heroui/react";
import { LogIn, Settings } from "lucide-react";
import React from "react";
import { ThemeSwitcher } from "../ui/ThemeSwitcher";
import Login from "../Login";

type Props = {};

const SidebarFooter = (props: Props) => {
    
  const dispatch = useAppDispatch();
  return (
    <div className="h-auto py-2 w-full flex flex-col gap-4 items-center justify-center">
      <ThemeSwitcher />
      <Tooltip placement="right" content={"تنظیمات"}>
        <Button
          radius="full"
          variant="light"
          size="lg"
          isIconOnly
          startContent={<Settings color="red" size={24} />}
          onPress={() => console.log("first")}
        ></Button>
      </Tooltip>

     <Login />
    </div>
  );
};

export default SidebarFooter;
