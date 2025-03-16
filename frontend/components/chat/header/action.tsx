"use client";
import { Button, Tooltip } from '@heroui/react';
import { PhoneCall, Search, Video, Volume2, VolumeOff } from 'lucide-react';
import React, { useState } from 'react'
import { AnyDeskIcon } from '../../ui/icons';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store/store';
import { setMessage } from '@/redux/slices/chatSocketSlice';
import { v4 } from 'uuid';
import {socket} from '@/config/socket-config';
import { Main } from '@/components/types/user.types';
import { text } from 'stream/consumers';

type Props = {
  reciever:string
}

const Action = ({reciever}: Props) => {
  const [mute, setMute] = useState(false);
  // const {chat}= useAppSelector((state:RootState)=>state)
  const dispatch = useAppDispatch()

  


  const sendMessage = () => {
      let user: any;
      const user_data = localStorage.getItem("user_data");
      if (user_data) {
        user = JSON.parse(user_data);
      }
    const data = {
      id:v4(),
      sender: user.uuid,
      receiver: reciever,
      data: {
        type:"anydesk",
        text:"12345678911",
        created_at: String(new Date()),
        status:"pending",
      }
    }

    dispatch(setMessage(data))
    socket.emit("test_message", data );
  }
  return (
    <>
     <Tooltip color="primary" content="جستجو...">
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            radius="full"
            startContent={<Search />}
          ></Button>
        </Tooltip>
        {/* <Tooltip color="primary" content="صدا">
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            radius="full"
            startContent={mute ? <Volume2 /> : <VolumeOff />}
            onPress={() => {
              setMute(!mute);
            }}
          ></Button>
        </Tooltip> */}
        {/* <div className="flex flex-1 justify-end gap-4 items-center"> */}
            

          <Tooltip color="primary" content="صوتی">
            <Button
              isIconOnly
              startContent={<PhoneCall />}
              color="primary"
              variant="flat"
              radius="full"
            ></Button>
          </Tooltip>
        

          <Tooltip color="primary" content="ویدیو">
            <Button
              isIconOnly
              startContent={<Video />}
              color="primary"
              variant="flat"
              radius="full"
            ></Button>
          </Tooltip>

          <Tooltip color="primary" content="انی دسک">
            <Button
              isIconOnly
              onPress={sendMessage}
              startContent={<AnyDeskIcon />}
              color="primary"
              variant="flat"
              radius="full"
            ></Button>
          </Tooltip>
        {/* </div> */}
    </>
  )
}

export default Action