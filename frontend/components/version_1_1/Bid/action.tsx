"use client";

import { comment_socket } from "@/config/socket-config";
import { formatTimeAgo } from "@/utils/tools";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@heroui/react";
import { Heart, MessageCircleMore, Reply, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { perform_get, perform_post } from "@/lib/api";

type Props = {
  tender_uuid: string;
  comment_id: string;
  is_like: boolean;
  like_count: number;
};

const Action = ({ comment_id, is_like, like_count, tender_uuid }: Props) => {
  const [like, setLike] = useState({
    is_like: is_like,
    count: like_count,
  });

  const likeHandler = async () => {
    const response = await perform_get(`api/v1/like_tender/${tender_uuid}/`);
    console.log(response);
    if (response.liked == true) {
      setLike({
        is_like: true,
        count: like.count + 1,
      });
    } else {
      setLike({
        is_like: false,
        count: like.count != 0 ? like.count - 1 : like.count,
      });
    }
  };

  return (
    <div className="flex flex-1 items-center gap-4 justify-end box-border pr-10">
      <Button
        startContent={
          <Heart
            className={`${
              like.is_like ? "fill-red-500 stroke-red-500" : "stroke-slate-100"
            }`}
          />
        }
        size="sm"
        variant="light"
        onPress={likeHandler}
      >
        {like.count}
      </Button>
      <CommentAction comment_id={comment_id} />
    </div>
  );
};

export default Action;

const CommentAction = ({ comment_id }: { comment_id: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [message, setMessage] = useState<string>();

  const user_data = localStorage.getItem("user_data");
  const parsed_user_data = user_data ? JSON.parse(user_data) : null;
  const [is_reply, setIsReply] = useState<string>("");
  const [comments_len,setLength] = useState<number>(0)
  const fetchComments = () => {
    comment_socket.emit("get_comments", `${comment_id}`);
    
  };

  useEffect(() => {

    fetchComments()


    comment_socket.on(`${comment_id}`, (data) => {
      console.log(data);
      if (data) {
        setComments(data.comments);
        setLength(data.comments.length)
      }
    });

    return () => {
      comment_socket.off(comment_socket.id);
    };
  }, []);

  const sendComment = () => {
    if (message?.length == 0) {
      setMessage("پیغامی وارد نکردید");
    } else {
      const data = {
        comment_id: comment_id,
        payload: {
          id: uuidv4(),
          user: {
            name:
              parsed_user_data?.first_name + " " + parsed_user_data?.last_name,
            uuid: parsed_user_data?.uuid,
            img: `${process.env.server}/${parsed_user_data?.image_profile}`,
          },
          created_at: new Date().toString(),
          text: message,
          reply: [],
        },
      };
      if (is_reply) {
        comment_socket.emit("reply_comment", {
          comment_id: comment_id,
          reply: {
            id: uuidv4(),
            user: {
              name:
                parsed_user_data?.first_name +
                " " +
                parsed_user_data?.last_name,
              uuid: parsed_user_data?.uuid,
              img: `${process.env.server}/${parsed_user_data?.image_profile}`,
            },
            created_at: new Date().toString(),
            text: message,
          },
        });
        setIsReply("");
        // setComments((prev)=>[...prev,])
      } else {
        comment_socket.emit("new_comment", data);
        setComments((prev) => [...prev, data.payload]);
      }
    }
  };

  const ReplyHandler = (value: string) => {
    if (is_reply.length == 0) {
      setIsReply(value);
    } else {
      setIsReply("");
    }
  };

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Button
          startContent={<MessageCircleMore />}
          size="sm"
          
          variant="light"
          onClick={fetchComments}
        >{comments_len}</Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className={`w-96 h-[500px] flex flex-col relative`} dir="rtl">
          <div className="flex-1 box-border p-4 overflow-y-auto">
            {comments.length == 0 && <div>کامنتی ثبت نشده</div>}

            {comments.length}
            {comments
              .map((comment: any) => {
                return (
                  <div
                    key={comment.id}
                    className={`w-full flex flex-col gap-2 justify-start rounded-3xl box-border p-4 ${
                      is_reply == comment.id ? "bg-foreground-200" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <User
                          avatarProps={{
                            src: comment.user.img,
                          }}
                          name={comment.user.name}
                        />
                        <span className="text-foreground-500 font-lightSans">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>

                      <Button
                        onPress={() => ReplyHandler(comment.id)}
                        variant={is_reply == comment.id ? "solid" : "light"}
                        color={is_reply == comment.id ? "default" : "primary"}
                        size="sm"
                        startContent={<Reply size={16} />}
                      >
                        پاسخ
                      </Button>
                    </div>
                    <p className="box-border pr-10 text-foreground-500 font-lightSans">
                      {comment.text}
                    </p>
                    <div className="w-full flex items-center justify-between box-border pr-10">
                      {comment.reply.length > 0 && (
                        <Button
                          onPress={() => setShow(!show)}
                          size="sm"
                          variant="light"
                          color="default"
                        >
                          پاسخ ها
                        </Button>
                      )}
                    </div>

                    <div
                      className={`flex flex-col box-border mt-2 pr-10 w-full overflow-hidden ${
                        show ? "h-auto" : "h-0"
                      } transition-all duration-500`}
                    >
                      {comment.reply.map((reply: any) => {
                        return <CommentList key={reply._id} comment={reply} />;
                      })}
                    </div>
                  </div>
                );
              })
              .reverse()}
          </div>
          <div className="flex gap-2 absolute items-center box-border px-2 bottom-0 bg-default-50 w-full h-14 rounded-b-2xl">
            <Button
              isIconOnly
              startContent={<SendIcon />}
              onPress={sendComment}
            ></Button>
            <Input
              placeholder={message ? message : "کامنت بنویس..."}
              onValueChange={(value) => {
                setMessage(value);
                console.log(value);
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CommentList = ({ comment }: { comment: any }) => {
  return (
    <div key={comment._id} className="w-full flex flex-col gap-2 justify-start">
      <div className="flex justify-between items-center">
        <User
          avatarProps={{
            size: "sm",
            src: comment.user.img,
          }}
          name={comment.user.name}
        />
      </div>
      <p className="box-border pr-10 text-foreground-500 font-lightSans">
        {comment.text}
      </p>
    </div>
  );
};
