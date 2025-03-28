"use client";
import { Main as UserType } from "@/components/types/user.types";
import { Main as PostType } from "@/components/types/posts";
import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import {
  Edit2,
  Eye,
  Heart,
  Music,
  PictureInPicture,
  Play,
  Plus,
  ProjectorIcon,
  UserRound,
  UserRoundPlus,
  Video,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import ModalVideoPlayer from "../ModalVideoPlayer";

type Props = {
  user: UserType;
  posts: PostType[];
};
const UserDashboard = ({ user, posts }: Props) => {
  const title = user?.user_expertise?.[0]?.expertise?.[0]?.title;

  const isLiked = () => {
    return posts.some((post) =>
      post.likes.some((like) => like.user.uuid === user.uuid)
    );
  };
  return (
    <>
      <div className="w-full flex h-auto gap-4 ">
        <div className="max-w-[500px] flex flex-col box-border p-4">
          <div className="rounded-full w-[90px] h-[90px] p-1 box-border border-2 border-secondary-500">
            <Image
              src={user.image_profile}
              alt="avatar"
              width={90}
              height={90}
              className="rounded-full aspect-square  bg-black"
            />
          </div>
          <div className=" w-3/4 h-full flex items-center justify-center gap-4 ">
            <Button
              variant="light"
              color="default"
              size="lg"
              className="flex flex-col py-2 box-border h-24"
            >
              {user.user_roles.includes("debugger") ? (
                <>
                  <span>دنبال کنندگان</span>
                  <span>{user.followers.count}</span>
                </>
              ) : (
                <>
                  <span>دنبال شوندگان</span>
                  <span>{user.followers.count || 0}</span>
                </>
              )}
            </Button>
            <Button
              variant="light"
              color="default"
              size="lg"
              className="flex flex-col py-2 box-border h-24"
            >
              {user.user_roles.includes("debugger") ? (
                <>
                  <span>پروژه های انجام شده</span>
                  <span>220</span>
                </>
              ) : (
                <>
                  <span>خدمات دریافت شده</span>
                  <span>220</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-foreground-500 text-justify">{user.user_bio || "برای بایو خود یک متن خوب بنویسید..."}</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">
          <h1 className="text-5xl py-2  font-bold bg-gradient-to-tr from-orange-900 to-orange-500 bg-clip-text text-transparent">
            {title ? title : "عنوان خود را وارد نمایید"}{" "}
            {title ? (
              title
            ) : (
              <Button
                isIconOnly
                startContent={<Edit2 />}
                variant="light"
                color="warning"
              ></Button>
            )}
          </h1>

          <div className="flex items-center justify-between  flex-row-reverse gap-4  absolute bottom-0">
            {user.user_roles.includes("debugger") &&
              user.user_resume.map((item) => {
                return (
                  <div
                    className="rounded-full w-auto h-auto aspect-square box-border p-2  border-2 border-orange-500"
                    key={item.id}
                  >
                    <Image
                      className="rounded-full aspect-square"
                      src={item.cv_file}
                      width={60}
                      height={60}
                      alt={item.title}
                    />
                  </div>
                );
              })}

            {user.user_roles.includes("debugger") &&
              user.user_resume.length != 5 && (
                <Button
                  className="w-[80px] h-[80px]"
                  radius="full"
                  variant="bordered"
                  color="warning"
                  startContent={<Plus color="orange" />}
                ></Button>
              )}
          </div>
        </div>

      
      </div>

      <div className=" w-full h-[1px] border-b-4 rounded-full border-black gap-4 grid grid-cols-2 my-5 "></div>

      <div className="min-h-96 max-w-7xl flex flex-col items-center ">
        <Tabs
          radius="full"
          size="lg"
          aria-label="Options"
          classNames={{
            base: "rounded-full bg-slate-800 border p-2 border-slate-800",
            tabList: "gap-6 w-full relative  rounded-none p-0 border-divider",
            cursor: "w-full bg-white",
            tab: "max-w-fit px-5",
            tabContent: "group-data-[selected=true]:text-[#000000]",
          }}
          color="primary"
          variant="light"
        >
          <Tab
            className="w-full"
            key="history"
            title={
              <div className="flex items-center space-x-2">
                <span>تاریخچه</span>
              </div>
            }
          ></Tab>
           { user.user_roles.includes("debugger") ? 
          <Tab
            className="w-full"
            key="learn"
            title={
              <div className="flex items-center space-x-2">
                <span>آموزش</span>
              </div>
            }
          >
            <div className="grid grid-cols-5">
              {posts.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex  items-center justify-center relative  border-l-2 border-b-2 border-slate-900 h-[500px]"
                  >
                    <ModalVideoPlayer
                      title={item.title}
                      url={item.video}
                      comments={item.comments}
                      post_id={item.id}
                      uuid={user.uuid}
                      is_liked={isLiked()}
                      count={item.likes_count}
                    />
                    <div className="z-0 w-full h-[500px] absolute">
                      <Image
                        alt="hello"
                        src={item.thumbnail}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="z-0 flex items-center gap-1 text-tiny absolute left-2 bottom-2 bg-transparent text-foreground p-2 rounded-full">
                      <span
                        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
                      >
                        {item.likes_count}
                      </span>
                      <Eye
                        size={14}
                        style={{ textShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Tab>
           :
           <Tab
           className="w-full"
           key="learn"
           title={
             <div className="flex items-center space-x-2">
               <span>آموزش ذخیره شده</span>
             </div>
           }
         >
           <div className="grid grid-cols-5">
             {posts.map((item) => {
               return (
                 <div
                   key={item.id}
                   className="flex  items-center justify-center relative  border-l-2 border-b-2 border-slate-900 h-[500px]"
                 >
                   <ModalVideoPlayer
                     title={item.title}
                     url={item.video}
                     comments={item.comments}
                     post_id={item.id}
                     uuid={user.uuid}
                     is_liked={isLiked()}
                     count={item.likes_count}
                   />
                   <div className="z-0 w-full h-[500px] absolute">
                     <Image
                       alt="hello"
                       src={item.thumbnail}
                       layout="fill"
                       objectFit="cover"
                     />
                   </div>
                   <div className="z-0 flex items-center gap-1 text-tiny absolute left-2 bottom-2 bg-transparent text-foreground p-2 rounded-full">
                     <span
                       style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
                     >
                       {item.likes_count}
                     </span>
                     <Eye
                       size={14}
                       style={{ textShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)" }}
                     />
                   </div>
                 </div>
               );
             })}
           </div>
         </Tab>

           }
     
     { user.user_roles.includes("debugger") &&
          <Tab
            key="cv"
            className="w-full"
            title={
              <div className="flex items-center space-x-2">
                <span>رزومه</span>
              </div>
            }
          >
            <div className="w-full min-h-[400px] border"></div>
          </Tab>
          }
        </Tabs>
      </div>
    </>
  );
};

export default UserDashboard;
