// "use client";
// import React, { useEffect, useState } from "react";
// import { Sidebar, SidebarBody, SidebarLink } from "./index";
"use client";

import { Button, ButtonGroup, Tooltip } from "@heroui/react";
import { Book, Bug, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// import { cn } from "@/lib/utils";
// import Main from "./Main";
// import { Avatar, Button } from "@heroui/react";
// import Image from "next/image";
// import Cookies from "js-cookie";
// import ProfileMenuButton from "@/components/routes/user/ProfileMenuButton";
// import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
// import { Book, Bug, Link, LogIn, User as UserIcon } from "lucide-react";
// import { showLogin } from "@/redux/slices/globalSlice";
// import { perform_get } from "@/lib/api";
// import { Main as UserInfo } from "@/components/types/user.types";
// export function SideBar() {
//   const [open, setOpen] = useState<boolean>(false);
//   const [User, setUser] = useState<UserInfo>();
//   const token = Cookies.get("token");
//   const { login } = useAppSelector((state: RootState) => state.gloabal);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const getUserData = async () => {
//       const response = await perform_get("auths/user_info/");
//       setUser(response);
//     };
//     getUserData();
//   }, []);

//   const openHandler = () => {
//     setOpen(!open);
//   };
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);
//   const ShowUserData = () => {
//     if (!isClient) return null;
//     if (token) {
//       return (
//         <SidebarLink
//           link={{
//             label: User?.username || '',
//             href: "#",
//             icon: User && <ProfileMenuButton user={User} />,
//           }}
//         />
//       );
//     } else {
//       return (
//         <SidebarLink
//         link={{
//           label: "وارد شوید",
//           href: "#",
//           icon: <Button
//           radius="full"
//           isIconOnly
//           startContent={<LogIn color="red" />}
//           className="shrink-0"
//           onPress={() => dispatch(showLogin(true))}
//         ></Button>
//         }}
//       />
//     )

//     }
//   };
//   const IconLinks = () => {
//     if (!isClient) return null;
//     const linkData = [
//       { name: "دیباگ پروژه", path: "/?content=query", icon: <Bug size={20} /> },
//       { name: "کلاس خصوصی", path: "/private_class", icon: <UserIcon size={20} /> },
//       { name: "دوره‌های آموزشی", path: "/courses", icon: <Book size={20} /> },
//     ];

//     return (
//       <div className="flex flex-col gap-3 shrink-0">
//         {linkData.map((item, index) => (
//           <SidebarLink
//           key={index}
//           link={{
//             label: item.name || '',
//             href: item.path,
//             icon: <Button startContent={item.icon} variant="light" isIconOnly ></Button>,
//           }}
//         />
//         ))}
//       </div>
//     );
//   };
//   return (
//     <div
//       className={cn(
//         "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden",
//         "h-screen"
//       )}
//     >
//       <Sidebar open={open} animate={false}>
//         <SidebarBody className="justify-between gap-10">
//           <div className="flex-1 flex flex-col  justify-center gap-4">
//             <IconLinks />
//           </div>
//           <div>{<ShowUserData />}</div>
//         </SidebarBody>
//       </Sidebar>
//       <Main openSideBar={openHandler} open={open} />
//     </div>
//   );
// }
const linkData = [
  { name: "دیباگ پروژه", path: "/debug", icon: Bug },
  { name: "کلاس خصوصی", path: "/private_class", icon: User },
  { name: "دوره‌های آموزشی", path: "/courses", icon: Book },
];

import React from "react";

type Props = {};

const SidebarBody = (props: Props) => {
  const pathname = usePathname();
  return (
    <div className="w-full flex-1  flex items-center flex-col justify-center py-4 box-border gap-4">
      {linkData.map((item, index) => {
        return (
          <Tooltip content={item.name} placement="right" key={index}>
            <Link href={item.path}>
              <Button
                variant={item.path === pathname ? "solid" : "light"}
                name={item.name}
                isIconOnly
                radius="full"
                color={item.path === pathname ? "primary" : "default"}
                startContent={<item.icon size={24} />}
                size="lg"
              ></Button>
            </Link>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SidebarBody;
