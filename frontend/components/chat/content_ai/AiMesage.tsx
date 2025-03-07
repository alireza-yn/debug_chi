import { Avatar } from '@heroui/react'
import React from 'react'

type Props = {
    message:string,
    audio:string | "",
}

const AiMesage = (props: Props) => {
  return (
    <div className="w-full h-auto box-border p-4 flex flex-col gap-2" dir='ltr'>
    <Avatar
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      name="Name"
      size="sm"
    />
    <div className="w-max box-border  min-h-14 rounded-r-full bg-purple-800 px-4 rounded-bl-full flex items-center">
      <span className="text-sm font-lightSans">{props.message}</span>
    </div>
  </div>
  )
}

export default AiMesage
