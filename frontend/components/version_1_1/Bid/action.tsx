import { Button } from '@heroui/react'
import { Heart, MessageCircleCode, MessageCircleMore, Send } from 'lucide-react'
import React from 'react'

type Props = {}

const Action = (props: Props) => {
  return (
    <div className='flex flex-1 items-center gap-4 justify-end box-border pr-10'>
        <Button startContent={<Heart />} size='sm' isIconOnly variant='light'></Button>
        <Button startContent={<MessageCircleMore />} size='sm' isIconOnly variant='light'></Button>
        <Button startContent={<Send />} size='sm' isIconOnly variant='light'></Button>
    </div>
  )
}

export default Action