"use client";
import { showLogin } from "@/redux/slices/globalSlice";
import { useAppDispatch } from "@/redux/store/store";
import { Avatar, Button, Link, Tooltip } from "@heroui/react";
import { LogIn, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ThemeSwitcher } from "../ui/ThemeSwitcher";
import Login from "../Login";
import { Main } from "@/components/types/user.types";
import { usePathname } from "next/navigation";

type Props = {
  user?: Main;
  token?:string;
};

const SidebarFooter = ({ user,token }: Props) => {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();
  useEffect(() => {
    if(token){
      const user_data = localStorage.getItem("user_data");
      if (user_data) {
        setUserData(JSON.parse(user_data));
        console.log(user_data)
      }
    }
  }, []);
  return (
    <div className="h-auto py-2 w-full flex flex-col gap-4 items-center justify-center">
      <ThemeSwitcher />

      {userData ? (
        <Tooltip
          placement="right"
          content={userData.first_name + " " + userData.last_name}
        >
          <Button
            size="lg"
            className="flex flex-col h-auto w-auto"
            variant="light"
            radius="full"
            as={Link}
            href="/user/dashboard"
          >
            <Avatar
            size="lg"
              src={`${process.env.server}/${userData.image_profile}`}
              name={userData.first_name}
              fallback={userData.first_name}
            />
            <span className="text-sm">{user?.username}</span>

          </Button>
        </Tooltip>
      ) : (
        <Tooltip placement="right" content={"ورود"}>
          <Button
            size="lg"
            variant="light"
            radius="full"
            isIconOnly
            startContent={<LogIn color="red" size={24} />}
            onPress={() => dispatch(showLogin({ show: true, path: pathname }))}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default SidebarFooter;
