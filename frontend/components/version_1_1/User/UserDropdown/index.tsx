import { Main } from "@/components/types/user.types";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {};

const UserDropdown = (props: Props) => {
  const [user, setUser] = useState<Main>();

  useEffect(() => {
    const user_data_in_localstorage = localStorage.getItem("user_data");
    user_data_in_localstorage
      ? setUser(JSON.parse(user_data_in_localstorage))
      : null;
  }, []);
  console.log(`${process.env.server}${user?.image_profile}`);

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          dir="ltr"
          as="button"
          avatarProps={{
            isBordered: true,
            src: `${process.env.server}${user?.image_profile}`,
          }}
          className="transition-transform"
          description={user?.username}
          name={`${user?.first_name} ${user?.last_name}`}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="settings">خانه</DropdownItem>
        <DropdownItem key="logout" color="danger" endContent={<LogOut />}>
          خروج
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropdown;
