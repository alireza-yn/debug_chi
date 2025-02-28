"use client";
import { Ripple } from '@/components/ui/magicUI/Ripple'
import { Button, Link } from '@heroui/react'
import localFont from 'next/font/local';
import React from 'react'

type Props = {
    iranSans:any
}

  
const Hero = (props: Props) => {
  return (
  <section className={`${props.iranSans.variable} relative w-full overflow-hidden min-h-[500px] mx-auto flex flex-col  items-center justify-center gap-14 my-14 dark:bg-black`}>
    <h1 className="text-amber-500 text-[60px] font-iranSans z-10">
      فوری ، مشاوره بگیر !
    </h1>
    <p className='text-center leading-10 z-10'>
    مشکلت رو بگو، ما متخصص را پیدا می کنیم!<br/>
    سریع، دقیق و مطمئن - بهترین مشاور برنامه نویسی درکنارته
    </p>
    <Button variant='shadow' color='warning' className='rounded-full border z-10' as={Link} href='/community/chat'>درخواست مشاوره فوری</Button>
    <div className=' h-full rounded-full  w-2/4 absolute top-1/4'>
    <Ripple animate={"false"} mainSize={150} numCircles={20} top='105%'/>
    </div>
  </section>



  )
}

export default Hero