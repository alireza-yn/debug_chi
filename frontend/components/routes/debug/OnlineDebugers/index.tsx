"use client";
import { PinContainer } from '@/components/ui/ace/3d-pin'
import { CardItem, ExpandableCard } from '@/components/ui/ace/evaluation-card';
import React, { useEffect } from 'react'

type Props = {
  data:CardItem[]
  button_title?:string
}



const OnlineDebugers = (props: Props) => {
  useEffect(()=>{

  },[])
  return (
    <section className='w-full  mx-auto min-h-[400px] my-10 flex flex-col items-center justify-around' dir='ltr'>
      <span>تیتر خود را بنویسید</span>
       <ExpandableCard
        cards={props.data}
        className="mb-10"
        button_name={props.button_title}
        sliderClassName="max-w-7xl mx-auto" // Customize slider container
        cardClassName="border border-neutral-100 dark:border-neutral-800" // Add border to cards
      />
    </section>
  )
}

export default OnlineDebugers
{/* <PinContainer
title="/ui.aceternity.com"
href="https://twitter.com/mannupaaji"
>
<div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
<h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
Aceternity UI
</h3>
<div className="text-base !m-0 !p-0 font-normal">
<span className="text-slate-500 ">
Customizable Tailwind CSS and Framer Motion Components.
</span>
</div>
<div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
</div>
</PinContainer> */}