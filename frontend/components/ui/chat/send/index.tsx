"use client";
import { Button, Input, InputOtp, Textarea } from '@heroui/react'
import { Code, Mic, Mic2, Paperclip, Pin, ScreenShare, Send, Voicemail } from 'lucide-react'
import React, { useState } from 'react'

type Props = {}

const SendChat = (props: Props) => {
  const [showSend,setShowSend] = useState(false)
  return (
    <div className='grid grid-cols-1 gap-4 h-full px-5 box-border  max-w-4xl mx-auto'>
        <div className='flex items-center justify-center gap-4 relative'>
          
        <Button isIconOnly startContent={showSend ? <Send /> : <Mic /> } variant='solid' color='primary' radius='full' className='absolute right-2 bottom-5 z-10'></Button>
        <Textarea
        onValueChange={(value)=>{
          if (value.length > 0){
            setShowSend(true)
          }else{
            setShowSend(false)
          }
        }}
        color='secondary'
        minRows={6}
        radius='lg'
        maxRows={8}
        className="w-full absolute"
        placeholder='متن خود را بنویسید...'
    />
      <div className='flex items-center justify-center gap-4 absolute left-2 bottom-5 z-10'>
            <Button isIconOnly startContent={<Paperclip />} variant='flat' ></Button>
            <Button isIconOnly startContent={<Code />} variant='flat' ></Button>
            <Button isIconOnly startContent={<ScreenShare />} variant='flat' ></Button>
        </div>
  
            {/* <Input type='text' variant='faded' color='warning'  size='lg'/> */}
        </div>
      
    </div>
  )
}

export default SendChat