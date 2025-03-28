import {
  LinearGradiant,
  LinearGradiantDownToTop,
} from "@/components/Tools/LinearGradiant";
import { Comment } from "@/components/types/posts";
import { perform_post } from "@/lib/api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  User,
} from "@heroui/react";
import { Heart, MessageCircle, Play, Share2 } from "lucide-react";
import { useState } from "react";

type Props = {
  post_id: number;
  title: string;
  url: string;
  comments: Comment[];
  uuid: string;
  is_liked:boolean;
  count:number;
};

export default function ModalVideoPlayer({ url, comments, title,is_liked,count,post_id }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(is_liked)
  const PostAction = async (data:any) => {
    const response = await perform_post("api/v1/like_post/", data);
    if (response) {
      // ✅ به‌روزرسانی مقدار لایک‌ها از سرور
      setActions({
        is_liked: response.is_liked,
        count: response.like_count
      });
    }
    console.log(response)
};

  const [actions,setActions]= useState({
    is_liked:is_liked,
    count:count
  })


  

  return (
    <>
      <Button
        variant="bordered"
        color="default"
        startContent={<Play className="fill-white" />}
        size="lg"
        isIconOnly
        radius="full"
        onPress={onOpen}
        className="z-50 border-slate-50"
      ></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="flex flex-row min-h-[500px]">
                <div className="flex-1 flex items-center justify-center  relative rounded-lg">
                  <video autoPlay controls className="rounded-lg">
                    <source src={url} />
                  </video>

                  <div className="bg-gradient-to-t from-black to-transparent w-full h-1/4 absolute bottom-0"></div>
                  <div className="absolute w-full flex flex-row items-center left-0 bottom-0">
                    <Button
                    onPress={() => PostAction({
                      action: 'like',
                      post_id: post_id,
                      liked: !actions.is_liked  // ارسال مقدار جدید به جای مقدار قدیمی
                    })}
                      variant="light"
                      isIconOnly
                      size="md"
                      radius="full"
                      startContent={actions.is_liked ? <Heart className="fill-red-600 stroke-red-600"/> : <Heart />}
                    ></Button>
                    <span>{actions.count}</span>
                    <Button
                      variant="light"
                      isIconOnly
                      size="md"
                      radius="full"
                      startContent={<MessageCircle />}
                    ></Button>
                    <span>{comments.length}</span>
                    {/* <div className="flex-1 flex justify-end items-center">
                <Button variant="light" isIconOnly size="md" radius="full" startContent={<Play className="fill-foreground"/>}></Button>
                </div> */}
                  </div>
                </div>
                <div
                  className="w-96 overflow-y-auto flex flex-col gap-4 h-[500px]"
                  dir="rtl"
                >
                  {comments.length == 0 ? (
                    <div>کامنتی وجود ندارد</div>
                  ) : (
                    comments.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="w-full flex flex-col items-start gap-1 h-auto"
                        >
                          <User
                            avatarProps={{
                              src: item.user.image_profile || "",
                            }}
                            name={
                              item.user.username ||
                              `${item.user.first_name} ${item.user.last_name}`
                            }
                          />
                          <span className="text-tiny mr-12 text-foreground-500">
                            {item.text}
                          </span>
                          <div className="w-2/4 h-[1px] mx-auto bg-slate-800 my-4"></div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
