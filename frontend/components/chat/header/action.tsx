import { Button, Tooltip } from '@heroui/react';
import { PhoneCall, Search, Video, Volume2, VolumeOff } from 'lucide-react';
import React, { useState } from 'react'
import { AnyDeskIcon } from '../../ui/icons';

type Props = {}

const Action = (props: Props) => {
  const [mute, setMute] = useState(false);

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
        <Tooltip color="primary" content="صدا">
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
        </Tooltip>
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